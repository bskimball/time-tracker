import { EmployeeStatus, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Create connection pool for the adapter
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is not set");
}
const pool = new Pool({ connectionString });

// Create adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
});

async function main() {
	console.log("🌱 Starting database seed...");

	// Clear existing data
	console.log("📦 Clearing existing data...");
	await prisma.timeLog.deleteMany();
	await prisma.callOut.deleteMany();
	await prisma.shiftAssignment.deleteMany();
	await prisma.shift.deleteMany();
	await prisma.employeeSkill.deleteMany();
	await prisma.skill.deleteMany();
	await prisma.taskAssignment.deleteMany();
	await prisma.performanceMetric.deleteMany();
	await prisma.taskType.deleteMany();
	await prisma.session.deleteMany();
	await prisma.oAuthAccount.deleteMany();
	await prisma.user.deleteMany();
	await prisma.employee.deleteMany();
	await prisma.breakPolicy.deleteMany();
	await prisma.station.deleteMany();
	await prisma.todo.deleteMany();

	// Create Stations
	console.log("🏭 Creating stations...");
	const stations = await Promise.all([
		prisma.station.create({
			data: {
				name: "PICKING",
				description: "Order picking and selection area",
				capacity: 15,
				isActive: true,
				zone: "A",
			},
		}),
		prisma.station.create({
			data: {
				name: "PACKING",
				description: "Order packing and quality check",
				capacity: 12,
				isActive: true,
				zone: "B",
			},
		}),
		prisma.station.create({
			data: {
				name: "FILLING",
				description: "Product filling and bottling",
				capacity: 10,
				isActive: true,
				zone: "C",
			},
		}),
		prisma.station.create({
			data: {
				name: "RECEIVING",
				description: "Incoming shipment receiving and inspection",
				capacity: 8,
				isActive: true,
				zone: "D",
			},
		}),
		prisma.station.create({
			data: {
				name: "SHIPPING",
				description: "Outbound shipment preparation and loading",
				capacity: 10,
				isActive: true,
				zone: "E",
			},
		}),
		prisma.station.create({
			data: {
				name: "QUALITY",
				description: "Quality control and assurance",
				capacity: 6,
				isActive: true,
				zone: "F",
			},
		}),
		prisma.station.create({
			data: {
				name: "INVENTORY",
				description: "Inventory management and stock control",
				capacity: 5,
				isActive: true,
				zone: "G",
			},
		}),
	]);

	console.log(`✅ Created ${stations.length} stations`);

	// Create sample PIN hash (for PIN: "1234")
	const samplePinHash = await bcrypt.hash("1234", 10);

	// Create Employees for a 3-shift operation (roughly 20-30 workers per shift)
	console.log("👥 Creating employees...");
	const activeEmployeesPerShift = 24;
	const shiftsPerDay = 3;
	const activeEmployeeCount = activeEmployeesPerShift * shiftsPerDay;
	const onLeaveCount = 6;
	const inactiveCount = 4;
	const totalEmployeeCount = activeEmployeeCount + onLeaveCount + inactiveCount;

	const firstNames = [
		"Alex",
		"Jordan",
		"Taylor",
		"Morgan",
		"Casey",
		"Riley",
		"Avery",
		"Quinn",
		"Skyler",
		"Reese",
		"Drew",
		"Cameron",
		"Harper",
		"Logan",
		"Parker",
		"Blake",
		"Rowan",
		"Dakota",
		"Sydney",
		"Kendall",
	];
	const lastNames = [
		"Smith",
		"Johnson",
		"Williams",
		"Brown",
		"Jones",
		"Miller",
		"Davis",
		"Garcia",
		"Rodriguez",
		"Martinez",
		"Hernandez",
		"Lopez",
		"Gonzalez",
		"Wilson",
		"Anderson",
		"Thomas",
		"Moore",
		"Jackson",
		"Martin",
		"Lee",
	];

	const seedNow = new Date();
	const employeeRows = Array.from({ length: totalEmployeeCount }, (_, index) => {
		const firstName = firstNames[index % firstNames.length];
		const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
		const station = stations[index % stations.length];
		const hireDate = new Date(seedNow);
		hireDate.setDate(seedNow.getDate() - ((index * 17) % (365 * 3)));

		const status: EmployeeStatus =
			index < activeEmployeeCount
				? "ACTIVE"
				: index < activeEmployeeCount + onLeaveCount
					? "ON_LEAVE"
					: "INACTIVE";

		return {
			name: `${firstName} ${lastName}`,
			email: `employee${String(index + 1).padStart(3, "0")}@warehouse.com`,
			pinHash: samplePinHash,
			employeeCode: `EMP${String(index + 1).padStart(4, "0")}`,
			phoneNumber: `555-${String(1000 + index).slice(-4)}`,
			hireDate,
			status,
			dailyHoursLimit: 8.0,
			weeklyHoursLimit: 40.0,
			defaultStationId: station.id,
		};
	});

	const employees = await Promise.all(
		employeeRows.map((row) =>
			prisma.employee.create({
				data: row,
			})
		)
	);

	console.log(`✅ Created ${employees.length} employees`);

	// Create Admin User
	console.log("👤 Creating admin user...");
	const adminEmployee = employees[0]; // John Smith as admin
	const adminUser = await prisma.user.create({
		data: {
			email: "admin@warehouse.com",
			name: "Admin User",
			role: "ADMIN",
			employeeId: adminEmployee.id,
			updatedAt: new Date(),
		},
	});

	console.log(`✅ Created admin user: ${adminUser.email}`);

	// Create Manager User
	console.log("👤 Creating manager user...");
	const managerEmployee = employees[1]; // Sarah Johnson as manager
	const managerUser = await prisma.user.create({
		data: {
			email: "manager@warehouse.com",
			name: "Manager User",
			role: "MANAGER",
			employeeId: managerEmployee.id,
			updatedAt: new Date(),
		},
	});

	console.log(`✅ Created manager user: ${managerUser.email}`);

	// Create Worker User
	console.log("👤 Creating worker user...");
	const workerEmployee = employees[2]; // Michael Chen as worker
	const workerUser = await prisma.user.create({
		data: {
			email: "worker@warehouse.com",
			name: "Worker User",
			role: "WORKER",
			employeeId: workerEmployee.id,
			updatedAt: new Date(),
		},
	});

	console.log(`✅ Created worker user: ${workerUser.email}`);

	// Create Task Types
	console.log("📋 Creating task types...");
	const taskTypes = await Promise.all([
		prisma.taskType.create({
			data: {
				name: "Pick Orders",
				stationId: stations[0].id, // PICKING
				description: "Pick items from shelves for orders",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Pack Orders",
				stationId: stations[1].id, // PACKING
				description: "Pack picked items into shipping boxes",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Fill Containers",
				stationId: stations[2].id, // FILLING
				description: "Fill product containers and bottles",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Receive Shipment",
				stationId: stations[3].id, // RECEIVING
				description: "Process incoming shipments",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Load Truck",
				stationId: stations[4].id, // SHIPPING
				description: "Load packages onto delivery trucks",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Quality Inspection",
				stationId: stations[5].id, // QUALITY
				description: "Inspect products for quality standards",
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Stock Count",
				stationId: stations[6].id, // INVENTORY
				description: "Count and verify inventory levels",
				isActive: true,
			},
		}),
	]);

	console.log(`✅ Created ${taskTypes.length} task types`);
	const now = new Date();
	const daysToSeed = 30;
	const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE");
	const taskTypeByStation = new Map(taskTypes.map((taskType) => [taskType.stationId, taskType]));

	const shiftTemplates = [
		{ label: "DAY", startHour: 6, durationHours: 8 },
		{ label: "SWING", startHour: 14, durationHours: 8 },
		{ label: "NIGHT", startHour: 22, durationHours: 8 },
	];

	const stationIdByName = new Map(stations.map((station) => [station.name, station.id]));
	const roleByStation = new Map<string, string>([
		[stationIdByName.get("PICKING") ?? "", "Picker"],
		[stationIdByName.get("PACKING") ?? "", "Packer"],
		[stationIdByName.get("FILLING") ?? "", "Filler"],
		[stationIdByName.get("RECEIVING") ?? "", "Receiver"],
		[stationIdByName.get("SHIPPING") ?? "", "Loader"],
		[stationIdByName.get("QUALITY") ?? "", "Inspector"],
		[stationIdByName.get("INVENTORY") ?? "", "Stock Associate"],
	]);

	console.log("🗓️ Creating shifts for the last 30 days...");
	const shiftRows: Array<{
		stationId: string;
		startTime: Date;
		endTime: Date;
		requiredHeadcount: number;
		shiftType: string;
	}> = [];

	for (let dayOffset = 0; dayOffset < daysToSeed; dayOffset++) {
		const baseDate = new Date(now);
		baseDate.setDate(now.getDate() - dayOffset);
		baseDate.setHours(0, 0, 0, 0);

		for (const [stationIndex, station] of stations.entries()) {
			for (const [shiftIndex, template] of shiftTemplates.entries()) {
				const shiftStart = new Date(baseDate);
				shiftStart.setHours(template.startHour, 0, 0, 0);
				const shiftEnd = new Date(shiftStart.getTime() + template.durationHours * 60 * 60 * 1000);

				const baselineHeadcount = Math.max(2, Math.round((station.capacity ?? 6) * 0.55));
				const headcountVariance = ((dayOffset + stationIndex + shiftIndex) % 3) - 1;

				shiftRows.push({
					stationId: station.id,
					startTime: shiftStart,
					endTime: shiftEnd,
					requiredHeadcount: Math.max(1, baselineHeadcount + headcountVariance),
					shiftType: template.label,
				});
			}
		}
	}

	await prisma.shift.createMany({ data: shiftRows });

	const shiftRangeStart = new Date(now);
	shiftRangeStart.setDate(now.getDate() - (daysToSeed - 1));
	shiftRangeStart.setHours(0, 0, 0, 0);

	const shifts = await prisma.shift.findMany({
		where: {
			startTime: {
				gte: shiftRangeStart,
			},
		},
		select: {
			id: true,
			stationId: true,
			startTime: true,
			endTime: true,
			shiftType: true,
		},
	});

	const shiftsByKey = new Map(
		shifts.map((shift) => [
			`${shift.stationId}|${shift.shiftType}|${shift.startTime.toISOString()}`,
			shift,
		])
	);

	console.log(`✅ Created ${shifts.length} shifts`);

	console.log("👷 Creating shift assignments and call-outs...");
	const shiftAssignmentRows: Array<{
		shiftId: string;
		employeeId: string;
		role: string;
		status: string;
		notes: string;
	}> = [];

	const callOutRows: Array<{
		employeeId: string;
		shiftId: string;
		date: Date;
		reason: string;
		status: string;
	}> = [];

	const scheduleRows: Array<{
		employeeId: string;
		stationId: string;
		shiftId: string;
		shiftStart: Date;
		shiftEnd: Date;
		inProgress: boolean;
		employeeIndex: number;
		dayOffset: number;
	}> = [];

	for (let dayOffset = 0; dayOffset < daysToSeed; dayOffset++) {
		const baseDate = new Date(now);
		baseDate.setDate(now.getDate() - dayOffset);
		baseDate.setHours(0, 0, 0, 0);

		for (const [employeeIndex, employee] of activeEmployees.entries()) {
			const isScheduledOff = (dayOffset + employeeIndex) % 7 >= 5;
			if (isScheduledOff) continue;

			const shiftTemplate = shiftTemplates[employeeIndex % shiftTemplates.length];
			const stationId =
				employee.defaultStationId ?? stations[(employeeIndex + dayOffset) % stations.length].id;

			const shiftStart = new Date(baseDate);
			shiftStart.setHours(shiftTemplate.startHour, 0, 0, 0);
			const shiftKey = `${stationId}|${shiftTemplate.label}|${shiftStart.toISOString()}`;
			const shift = shiftsByKey.get(shiftKey);

			if (!shift) continue;

			const inProgress = dayOffset === 0 && shift.startTime <= now && shift.endTime > now;
			const isCallOut = !inProgress && (employeeIndex * 11 + dayOffset * 7) % 31 === 0;

			if (isCallOut) {
				callOutRows.push({
					employeeId: employee.id,
					shiftId: shift.id,
					date: shift.startTime,
					reason: "Sick leave",
					status: "APPROVED",
				});
				continue;
			}

			const role = roleByStation.get(stationId) ?? "Associate";
			const status = inProgress ? "IN_PROGRESS" : "COMPLETED";

			shiftAssignmentRows.push({
				shiftId: shift.id,
				employeeId: employee.id,
				role,
				status,
				notes: dayOffset === 0 ? "Current roster" : `Rostered d-${dayOffset}`,
			});

			scheduleRows.push({
				employeeId: employee.id,
				stationId,
				shiftId: shift.id,
				shiftStart: shift.startTime,
				shiftEnd: shift.endTime,
				inProgress,
				employeeIndex,
				dayOffset,
			});
		}
	}

	if (shiftAssignmentRows.length > 0) {
		await prisma.shiftAssignment.createMany({ data: shiftAssignmentRows });
	}

	if (callOutRows.length > 0) {
		await prisma.callOut.createMany({ data: callOutRows });
	}

	const activeShiftAssignmentCount = shiftAssignmentRows.filter(
		(assignment) => assignment.status === "IN_PROGRESS"
	).length;

	console.log(
		`✅ Created ${shiftAssignmentRows.length} shift assignments (${activeShiftAssignmentCount} active) and ${callOutRows.length} call-outs`
	);

	console.log("📋 Creating task assignments tied to shift activity...");
	type CreatedTaskRecord = {
		id: string;
		employeeId: string;
		stationId: string;
		startTime: Date;
		endTime: Date | null;
		inProgress: boolean;
		employeeIndex: number;
		dayOffset: number;
	};

	const createdTasks: CreatedTaskRecord[] = [];

	for (const [rowIndex, row] of scheduleRows.entries()) {
		const stationTaskType = taskTypeByStation.get(row.stationId);
		const selectedTaskType = stationTaskType ?? taskTypes[rowIndex % taskTypes.length];
		const taskStart = new Date(row.shiftStart.getTime() + ((rowIndex % 4) * 10 + 5) * 60 * 1000);
		const taskEnd = row.inProgress
			? null
			: new Date(row.shiftEnd.getTime() - (25 + (rowIndex % 3) * 10) * 60 * 1000);
		const spanHours = (taskEnd?.getTime() ?? now.getTime()) - taskStart.getTime();
		const hoursWorked = Math.max(0.75, spanHours / (60 * 60 * 1000));
		const unitsCompleted = row.inProgress
			? Math.max(10, Math.round(hoursWorked * (10 + (rowIndex % 5))))
			: Math.max(40, Math.round(hoursWorked * (18 + (rowIndex % 8))));

		const task = await prisma.taskAssignment.create({
			data: {
				employeeId: row.employeeId,
				taskTypeId: selectedTaskType.id,
				source: "MANAGER",
				assignedByUserId: managerUser.id,
				startTime: taskStart,
				endTime: taskEnd,
				unitsCompleted,
				notes: row.inProgress
					? `In progress - ${selectedTaskType.name}`
					: `Completed - ${selectedTaskType.name}`,
			},
			select: {
				id: true,
			},
		});

		createdTasks.push({
			id: task.id,
			employeeId: row.employeeId,
			stationId: row.stationId,
			startTime: taskStart,
			endTime: taskEnd,
			inProgress: row.inProgress,
			employeeIndex: row.employeeIndex,
			dayOffset: row.dayOffset,
		});
	}

	const activeTaskCount = createdTasks.filter((task) => task.endTime === null).length;

	console.log(`✅ Created ${createdTasks.length} task assignments (${activeTaskCount} active)`);

	console.log("🕒 Creating time logs linked to tasks...");
	const clockMethods = ["PIN", "CARD", "BIOMETRIC"] as const;
	const timeLogRows = createdTasks.map((task, index) => ({
		employeeId: task.employeeId,
		stationId: task.stationId,
		taskId: task.id,
		startTime: new Date(task.startTime.getTime() - ((index % 3) * 5 + 3) * 60 * 1000),
		endTime: task.inProgress ? null : task.endTime,
		note: task.inProgress ? "Active shift in progress" : "Completed scheduled shift",
		clockMethod: clockMethods[index % clockMethods.length],
		updatedAt: new Date(),
	}));

	if (timeLogRows.length > 0) {
		await prisma.timeLog.createMany({ data: timeLogRows });
	}

	const activeTimeLogCount = timeLogRows.filter((log) => log.endTime === null).length;
	console.log(`✅ Created ${timeLogRows.length} time logs (${activeTimeLogCount} active)`);

	console.log("📈 Creating last-30-days performance metrics...");
	const activeEmployeesForMetrics = employees.filter((employee) => employee.status === "ACTIVE");
	const stationBaselineRate = new Map<string, number>([
		["PICKING", 28],
		["PACKING", 24],
		["FILLING", 32],
		["RECEIVING", 20],
		["SHIPPING", 26],
		["QUALITY", 18],
		["INVENTORY", 16],
	]);

	const metricRows: Array<{
		employeeId: string;
		date: Date;
		stationId: string | null;
		hoursWorked: number;
		unitsProcessed: number;
		efficiency: number;
		qualityScore: number;
		overtimeHours: number;
	}> = [];

	for (let dayOffset = 0; dayOffset < daysToSeed; dayOffset++) {
		const metricDate = new Date();
		metricDate.setDate(metricDate.getDate() - dayOffset);
		metricDate.setHours(0, 0, 0, 0);

		for (const [employeeIndex, employee] of activeEmployeesForMetrics.entries()) {
			if (!employee.defaultStationId) continue;

			const isScheduledOff = (dayOffset + employeeIndex) % 7 >= 5;
			const calledOut = (employeeIndex * 11 + dayOffset * 7) % 31 === 0;
			if (isScheduledOff || calledOut) continue;

			const station = stations.find((s) => s.id === employee.defaultStationId);
			const stationName = station?.name ?? "PICKING";
			const baselineRate = stationBaselineRate.get(stationName) ?? 24;

			const dailyVariation = ((dayOffset * 3 + employeeIndex * 5) % 11) - 5;
			const hoursWorked = Number((7.2 + ((dayOffset + employeeIndex) % 4) * 0.45).toFixed(2));
			const overtimeHours = Math.max(0, Number((hoursWorked - 8).toFixed(2)));
			const unitsProcessed = Math.max(
				0,
				Math.round(hoursWorked * (baselineRate + dailyVariation * 0.65))
			);
			const efficiency = Number((unitsProcessed / hoursWorked).toFixed(2));
			const qualityScore = Number((94 + ((employeeIndex + dayOffset) % 6) * 0.6).toFixed(2));

			metricRows.push({
				employeeId: employee.id,
				date: metricDate,
				stationId: employee.defaultStationId,
				hoursWorked,
				unitsProcessed,
				efficiency,
				qualityScore,
				overtimeHours,
			});
		}
	}

	if (metricRows.length > 0) {
		await prisma.performanceMetric.createMany({
			data: metricRows,
		});
	}

	console.log(`✅ Created ${metricRows.length} performance metric rows`);

	console.log("\n✨ Database seeded successfully!");
	console.log("\n📊 Summary:");
	console.log(`   - Stations: ${stations.length}`);
	console.log(
		`   - Employees: ${employees.length} (${activeEmployeeCount} active, ${onLeaveCount} on leave, ${inactiveCount} inactive)`
	);
	console.log(`   - Shifts: ${shifts.length}`);
	console.log(
		`   - Shift Assignments: ${shiftAssignmentRows.length} (${activeShiftAssignmentCount} active)`
	);
	console.log(`   - Call Outs: ${callOutRows.length}`);
	console.log(`   - Task Types: ${taskTypes.length}`);
	console.log(`   - Task Assignments: ${createdTasks.length} (${activeTaskCount} active)`);
	console.log(`   - Time Logs: ${timeLogRows.length} (${activeTimeLogCount} active)`);
	console.log(`   - Performance Metrics: ${metricRows.length}`);
	console.log(`   - Users: 3 (Admin, Manager, Worker)`);
	console.log("\n🔑 Login Information:");
	console.log(`   - Admin: admin@warehouse.com`);
	console.log(`   - Manager: manager@warehouse.com`);
	console.log(`   - Worker: worker@warehouse.com`);
	console.log(`   - Employee PIN for all: 1234`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
