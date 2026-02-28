import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";
import { Station_name } from "@prisma/client";
import { db } from "~/lib/db";
import { ensureOperationalConfigSeeded } from "~/lib/operational-config";

type SeedEmployee = {
	name: string;
	email: string;
	employeeCode: string;
	defaultStationName: Station_name;
	status?: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
};

const seedEmployees: SeedEmployee[] = [
	{
		name: "John Smith",
		email: "john.smith@warehouse.com",
		employeeCode: "EMP001",
		defaultStationName: "PICKING",
	},
	{
		name: "Sarah Johnson",
		email: "sarah.johnson@warehouse.com",
		employeeCode: "EMP002",
		defaultStationName: "PACKING",
	},
	{
		name: "Michael Chen",
		email: "michael.chen@warehouse.com",
		employeeCode: "EMP003",
		defaultStationName: "FILLING",
	},
	{
		name: "Emily Davis",
		email: "emily.davis@warehouse.com",
		employeeCode: "EMP004",
		defaultStationName: "RECEIVING",
	},
	{
		name: "David Martinez",
		email: "david.martinez@warehouse.com",
		employeeCode: "EMP005",
		defaultStationName: "SHIPPING",
	},
	{
		name: "Jennifer Wilson",
		email: "jennifer.wilson@warehouse.com",
		employeeCode: "EMP006",
		defaultStationName: "QUALITY",
	},
	{
		name: "Robert Taylor",
		email: "robert.taylor@warehouse.com",
		employeeCode: "EMP007",
		defaultStationName: "INVENTORY",
	},
];

let ensurePromise: Promise<void> | null = null;

export async function ensureOperationalDataSeeded() {
	if (!ensurePromise) {
		ensurePromise = seedOperationalData().finally(() => {
			ensurePromise = null;
		});
	}

	await ensurePromise;
}

async function seedOperationalData() {
	await ensureOperationalConfigSeeded();

	const [stationCount, employeeCount] = await Promise.all([
		db.station.count(),
		db.employee.count(),
	]);

	if (stationCount === 0) {
		await db.station.createMany({
			data: [
				{
					name: "PICKING",
					description: "Order picking and selection area",
					capacity: 15,
					isActive: true,
					zone: "A",
				},
				{
					name: "PACKING",
					description: "Order packing and quality check",
					capacity: 12,
					isActive: true,
					zone: "B",
				},
				{
					name: "FILLING",
					description: "Product filling and bottling",
					capacity: 10,
					isActive: true,
					zone: "C",
				},
				{
					name: "RECEIVING",
					description: "Incoming shipment receiving and inspection",
					capacity: 8,
					isActive: true,
					zone: "D",
				},
				{
					name: "SHIPPING",
					description: "Outbound shipment preparation and loading",
					capacity: 10,
					isActive: true,
					zone: "E",
				},
				{
					name: "QUALITY",
					description: "Quality control and assurance",
					capacity: 6,
					isActive: true,
					zone: "F",
				},
				{
					name: "INVENTORY",
					description: "Inventory management and stock control",
					capacity: 5,
					isActive: true,
					zone: "G",
				},
			],
		});
	}

	if (employeeCount === 0) {
		const stations = await db.station.findMany();
		const stationByName = new Map(stations.map((station) => [station.name, station]));
		const pinHash = await bcrypt.hash("1234", 10);

		for (const [index, seedEmployee] of seedEmployees.entries()) {
			const defaultStation = stationByName.get(seedEmployee.defaultStationName);
			if (!defaultStation) {
				continue;
			}

			await db.employee.create({
				data: {
					name: seedEmployee.name,
					email: seedEmployee.email,
					employeeCode: seedEmployee.employeeCode,
					phoneNumber: `555-01${String(index + 1).padStart(2, "0")}`,
					pinHash,
					status: seedEmployee.status ?? "ACTIVE",
					dailyHoursLimit: 8,
					weeklyHoursLimit: 40,
					defaultStationId: defaultStation.id,
				},
			});
		}
	}

	const [
		taskTypeCount,
		shiftCount,
		shiftAssignmentCount,
		taskAssignmentCount,
		metricCount,
		timeLogCount,
	] = await Promise.all([
		db.taskType.count(),
		db.shift.count(),
		db.shiftAssignment.count(),
		db.taskAssignment.count(),
		db.performanceMetric.count(),
		db.timeLog.count(),
	]);

	const stations = await db.station.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});
	const activeEmployees = await db.employee.findMany({
		where: { status: "ACTIVE" },
		orderBy: { name: "asc" },
	});

	if (taskTypeCount === 0 && stations.length > 0) {
		await db.taskType.createMany({
			data: stations.map((station, index) => ({
				name: `${station.name.toLowerCase().charAt(0).toUpperCase()}${station.name.toLowerCase().slice(1)} Ops`,
				stationId: station.id,
				description: `Primary workflow tasks for ${station.name}`,
				estimatedMinutesPerUnit: 2 + (index % 5),
				isActive: true,
			})),
		});
	}

	if (shiftCount === 0 && stations.length > 0) {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const shiftRows: Array<{
			stationId: string;
			startTime: Date;
			endTime: Date;
			requiredHeadcount: number;
			shiftType: string;
		}> = [];

		for (let day = 0; day < 7; day++) {
			const dayDate = addDays(now, day);
			for (const station of stations) {
				const capacity = station.capacity ?? 4;
				shiftRows.push(
					{
						stationId: station.id,
						startTime: new Date(
							dayDate.getFullYear(),
							dayDate.getMonth(),
							dayDate.getDate(),
							6,
							0,
							0
						),
						endTime: new Date(
							dayDate.getFullYear(),
							dayDate.getMonth(),
							dayDate.getDate(),
							14,
							0,
							0
						),
						requiredHeadcount: Math.max(1, Math.ceil(capacity * 0.6)),
						shiftType: "MORNING",
					},
					{
						stationId: station.id,
						startTime: new Date(
							dayDate.getFullYear(),
							dayDate.getMonth(),
							dayDate.getDate(),
							14,
							0,
							0
						),
						endTime: new Date(
							dayDate.getFullYear(),
							dayDate.getMonth(),
							dayDate.getDate(),
							22,
							0,
							0
						),
						requiredHeadcount: Math.max(1, Math.ceil(capacity * 0.4)),
						shiftType: "SWING",
					}
				);
			}
		}

		for (const shiftRow of shiftRows) {
			await db.shift.create({ data: shiftRow });
		}
	}

	if ((shiftAssignmentCount === 0 || taskAssignmentCount === 0) && activeEmployees.length > 0) {
		const taskTypes = await db.taskType.findMany({ orderBy: { name: "asc" } });
		const shifts = await db.shift.findMany({
			orderBy: [{ startTime: "asc" }],
			include: { station: true },
		});

		for (const [index, shift] of shifts.entries()) {
			const headcount = Math.min(shift.requiredHeadcount, activeEmployees.length);

			if (shiftAssignmentCount === 0) {
				for (let slot = 0; slot < headcount; slot++) {
					const employee = activeEmployees[(index + slot) % activeEmployees.length];
					await db.shiftAssignment.create({
						data: {
							shiftId: shift.id,
							employeeId: employee.id,
							role: slot === 0 ? "LEAD" : "ASSOCIATE",
							status: "CONFIRMED",
							notes: "Auto-seeded baseline schedule",
						},
					});
				}
			}

			const stationTaskType = taskTypes.find((taskType) => taskType.stationId === shift.stationId);
			if (taskAssignmentCount === 0 && stationTaskType) {
				const isCurrentShift = shift.startTime <= new Date() && shift.endTime > new Date();
				for (let slot = 0; slot < headcount; slot++) {
					const employee = activeEmployees[(index + slot) % activeEmployees.length];
					const taskStart = new Date(shift.startTime.getTime() + slot * 25 * 60 * 1000);
					const taskEnd = isCurrentShift
						? null
						: new Date(Math.min(shift.endTime.getTime(), taskStart.getTime() + 4 * 60 * 60 * 1000));

					await db.taskAssignment.create({
						data: {
							employeeId: employee.id,
							taskTypeId: stationTaskType.id,
							startTime: taskStart,
							endTime: taskEnd,
							unitsCompleted: taskEnd ? 90 + ((index + slot) % 60) : null,
							notes: "Auto-seeded operational task",
						},
					});
				}
			}
		}
	}

	if (metricCount === 0 && activeEmployees.length > 0) {
		const stationById = new Map(stations.map((station) => [station.id, station]));
		for (let day = 0; day < 45; day++) {
			const metricDate = subDays(new Date(), day);
			metricDate.setHours(0, 0, 0, 0);

			for (const [index, employee] of activeEmployees.entries()) {
				if (!employee.defaultStationId) {
					continue;
				}

				const station = stationById.get(employee.defaultStationId);
				const baseline = station?.name === "FILLING" ? 32 : station?.name === "RECEIVING" ? 20 : 26;
				const hoursWorked = 7 + ((index + day) % 4) * 0.5;
				const unitsProcessed = Math.round(hoursWorked * (baseline + (((index + day) % 5) - 2)));
				const overtimeHours = Math.max(0, hoursWorked - 8);

				await db.performanceMetric.create({
					data: {
						employeeId: employee.id,
						date: metricDate,
						stationId: employee.defaultStationId,
						hoursWorked,
						unitsProcessed,
						efficiency: unitsProcessed / hoursWorked,
						qualityScore: 94 + ((index + day) % 4),
						overtimeHours,
					},
				});
			}
		}
	}

	if (timeLogCount === 0 && activeEmployees.length > 0) {
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(6, 0, 0, 0);

		for (const [index, employee] of activeEmployees.entries()) {
			const stationId = employee.defaultStationId;
			if (!stationId) {
				continue;
			}

			const startTime = new Date(todayStart.getTime() + index * 30 * 60 * 1000);
			const endTime = index < 3 ? null : new Date(startTime.getTime() + 7.5 * 60 * 60 * 1000);

			await db.timeLog.create({
				data: {
					employeeId: employee.id,
					stationId,
					type: "WORK",
					startTime,
					endTime,
					clockMethod: "PIN",
					note: "Auto-seeded operational time log",
					updatedAt: new Date(),
				},
			});
		}
	}
}
