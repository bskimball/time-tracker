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

	// Unlink employees from users so we can delete employees safely
	await prisma.user.updateMany({
		data: { employeeId: null },
	});

	// Delete all users except admin and manager
	await prisma.user.deleteMany({
		where: {
			email: { notIn: ["admin@warehouse.com", "manager@warehouse.com"] },
		},
	});
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

	// Create Employees for a large 3-shift fulfillment operation
	console.log("👥 Creating employees for large fulfillment operation...");
	const activeEmployeesPerShift = 68; // ~204 active workers across 3 shifts
	const shiftsPerDay = 3;
	const activeEmployeeCount = activeEmployeesPerShift * shiftsPerDay;
	const onLeaveCount = 18;
	const inactiveCount = 12;
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

	// Update Admin User
	console.log("👤 Updating admin user...");
	const adminEmployee = employees[0]; // John Smith as admin
	const adminUser = await prisma.user.upsert({
		where: { email: "admin@warehouse.com" },
		update: {
			name: "Admin User",
			role: "ADMIN",
			employeeId: adminEmployee.id,
			updatedAt: new Date(),
		},
		create: {
			email: "admin@warehouse.com",
			name: "Admin User",
			role: "ADMIN",
			employeeId: adminEmployee.id,
			updatedAt: new Date(),
		},
	});

	console.log(`✅ Updated admin user: ${adminUser.email}`);

	// Update Manager User
	console.log("👤 Updating manager user...");
	const managerEmployee = employees[1]; // Sarah Johnson as manager
	const managerUser = await prisma.user.upsert({
		where: { email: "manager@warehouse.com" },
		update: {
			name: "Manager User",
			role: "MANAGER",
			employeeId: managerEmployee.id,
			updatedAt: new Date(),
		},
		create: {
			email: "manager@warehouse.com",
			name: "Manager User",
			role: "MANAGER",
			employeeId: managerEmployee.id,
			updatedAt: new Date(),
		},
	});

	console.log(`✅ Updated manager user: ${managerUser.email}`);

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
	const daysToSeed = 730;
	const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE");

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

	console.log("🗓️ Creating shifts for the last 730 days...");
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
		const chunkSize = 5000;
		for (let i = 0; i < shiftAssignmentRows.length; i += chunkSize) {
			const chunk = shiftAssignmentRows.slice(i, i + chunkSize);
			await prisma.shiftAssignment.createMany({ data: chunk });
		}
	}

	if (callOutRows.length > 0) {
		const chunkSize = 5000;
		for (let i = 0; i < callOutRows.length; i += chunkSize) {
			const chunk = callOutRows.slice(i, i + chunkSize);
			await prisma.callOut.createMany({ data: chunk });
		}
	}

	const activeShiftAssignmentCount = shiftAssignmentRows.filter(
		(assignment) => assignment.status === "IN_PROGRESS"
	).length;

	console.log(
		`✅ Created ${shiftAssignmentRows.length} shift assignments (${activeShiftAssignmentCount} active) and ${callOutRows.length} call-outs`
	);

	console.log(
		"📋 Creating high-volume task assignments (large fulfillment - multiple tasks per shift)..."
	);
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
	const taskRows: Array<{
		id: string;
		employeeId: string;
		taskTypeId: string;
		source: "MANAGER" | "WORKER";
		assignedByUserId: string;
		startTime: Date;
		endTime: Date | null;
		unitsCompleted: number;
		notes: string;
	}> = [];

	// In a large fulfillment house, workers complete many small tasks per shift (pick waves, pack orders, etc.)
	const tasksPerScheduledShift = 6;

	for (const [rowIndex, row] of scheduleRows.entries()) {
		const shiftDurationMs = row.shiftEnd.getTime() - row.shiftStart.getTime();
		const taskDurationMs = Math.floor(shiftDurationMs / tasksPerScheduledShift);

		for (let t = 0; t < tasksPerScheduledShift; t++) {
			const taskStart = new Date(
				row.shiftStart.getTime() + t * taskDurationMs + (t % 3) * 4 * 60 * 1000
			);
			const isLastTask = t === tasksPerScheduledShift - 1;
			const taskEnd =
				row.inProgress && isLastTask
					? null
					: new Date(
							Math.min(
								row.shiftEnd.getTime() - 8 * 60 * 1000,
								taskStart.getTime() + taskDurationMs - 6 * 60 * 1000
							)
						);

			const spanHours =
				((taskEnd?.getTime() ?? now.getTime()) - taskStart.getTime()) / (60 * 60 * 1000);
			const hoursWorked = Math.max(0.4, spanHours);

			// Distribute units across multiple tasks per shift
			const baseUnits = row.inProgress ? 12 + (rowIndex % 7) : 22 + (rowIndex % 11);

			const unitsCompleted = Math.max(
				5,
				Math.round(hoursWorked * baseUnits * (0.85 + (t % 4) * 0.08))
			);

			const taskType = taskTypes[(rowIndex + t) % taskTypes.length];
			const taskId = crypto.randomUUID();

			taskRows.push({
				id: taskId,
				employeeId: row.employeeId,
				taskTypeId: taskType.id,
				source: (rowIndex + t) % 5 === 0 ? "WORKER" : "MANAGER", // occasional self-assignment
				assignedByUserId: managerUser.id,
				startTime: taskStart,
				endTime: taskEnd,
				unitsCompleted,
				notes:
					row.inProgress && isLastTask
						? `In progress - ${taskType.name}`
						: `Completed - ${taskType.name}`,
			});

			createdTasks.push({
				id: taskId,
				employeeId: row.employeeId,
				stationId: row.stationId,
				startTime: taskStart,
				endTime: taskEnd,
				inProgress: row.inProgress && isLastTask,
				employeeIndex: row.employeeIndex,
				dayOffset: row.dayOffset,
			});
		}
	}

	if (taskRows.length > 0) {
		// Batch insert tasks in chunks of 5000
		const chunkSize = 5000;
		for (let i = 0; i < taskRows.length; i += chunkSize) {
			const chunk = taskRows.slice(i, i + chunkSize);
			await prisma.taskAssignment.createMany({ data: chunk });
		}
	}

	const activeTaskCount = createdTasks.filter((task) => task.endTime === null).length;

	console.log(
		`✅ Created ${createdTasks.length} task assignments (${activeTaskCount} active) — ~6 tasks per shift`
	);

	console.log("🕒 Creating time logs (one per scheduled shift)...");
	const clockMethods = ["PIN", "CARD", "BIOMETRIC"] as const;
	const timeLogRows = scheduleRows.map((row, index) => ({
		employeeId: row.employeeId,
		stationId: row.stationId,
		taskId: null, // Time log is at shift level; tasks are detailed work within the shift
		startTime: new Date(row.shiftStart.getTime() - ((index % 3) * 4 + 2) * 60 * 1000),
		endTime: row.inProgress ? null : row.shiftEnd,
		note: row.inProgress ? "Active shift in progress" : "Completed scheduled shift",
		clockMethod: clockMethods[index % clockMethods.length],
		updatedAt: new Date(),
	}));

	if (timeLogRows.length > 0) {
		const chunkSize = 5000;
		for (let i = 0; i < timeLogRows.length; i += chunkSize) {
			const chunk = timeLogRows.slice(i, i + chunkSize);
			await prisma.timeLog.createMany({ data: chunk });
		}
	}

	const activeTimeLogCount = timeLogRows.filter((log) => log.endTime === null).length;
	console.log(`✅ Created ${timeLogRows.length} time logs (${activeTimeLogCount} active)`);

	console.log("📈 Creating last-730-days performance metrics (large fulfillment patterns)...");
	const activeEmployeesForMetrics = employees.filter((employee) => employee.status === "ACTIVE");

	// Realistic units-per-hour baselines for a modern large fulfillment center
	const stationBaselineRate = new Map<string, number>([
		["PICKING", 52], // High-volume small items
		["PACKING", 38],
		["FILLING", 45],
		["RECEIVING", 28],
		["SHIPPING", 34],
		["QUALITY", 22],
		["INVENTORY", 19],
	]);

	// Performance tiers for realistic variance (top performers stand out)
	const getPerformanceMultiplier = (employeeIndex: number): number => {
		const tier = employeeIndex % 10;
		if (tier === 0 || tier === 1) return 1.28; // Top 20% - strong performers
		if (tier === 2 || tier === 3 || tier === 4) return 1.08; // Solid average
		if (tier === 5 || tier === 6 || tier === 7) return 0.94; // Below average
		return 0.82; // Bottom 20% - struggling
	};

	// Seasonal multiplier (Q4 peak for fulfillment, Jan dip)
	const getSeasonalMultiplier = (date: Date): number => {
		const month = date.getMonth(); // 0 = Jan
		if (month === 10 || month === 11) return 1.22; // Nov-Dec holiday peak
		if (month === 0 || month === 1) return 0.82; // Jan-Feb slow
		if (month === 8 || month === 9) return 1.09; // Sep-Oct ramp up
		return 1.0;
	};

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

		const seasonalMultiplier = getSeasonalMultiplier(metricDate);

		for (const [employeeIndex, employee] of activeEmployeesForMetrics.entries()) {
			if (!employee.defaultStationId) continue;

			const isScheduledOff = (dayOffset + employeeIndex) % 7 >= 5;
			const calledOut = (employeeIndex * 11 + dayOffset * 7) % 31 === 0;
			if (isScheduledOff || calledOut) continue;

			const station = stations.find((s) => s.id === employee.defaultStationId);
			const stationName = station?.name ?? "PICKING";
			const baselineRate = stationBaselineRate.get(stationName) ?? 30;

			const perfMultiplier = getPerformanceMultiplier(employeeIndex);

			// Daily noise + performance tier + seasonal effect
			const dailyNoise = ((dayOffset * 2 + employeeIndex * 3) % 7) - 3;
			const hoursWorked = Number((7.5 + ((dayOffset + employeeIndex) % 3) * 0.35).toFixed(2));
			const overtimeHours = Math.max(0, Number((hoursWorked - 8).toFixed(2)));

			const rawUnits = hoursWorked * baselineRate * perfMultiplier * seasonalMultiplier;
			const unitsProcessed = Math.max(0, Math.round(rawUnits + dailyNoise * 1.8));

			const efficiency = Number((unitsProcessed / hoursWorked).toFixed(1));
			const qualityScore = Number((93.5 + ((employeeIndex + dayOffset) % 7) * 0.55).toFixed(1));

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
		const chunkSize = 5000;
		for (let i = 0; i < metricRows.length; i += chunkSize) {
			const chunk = metricRows.slice(i, i + chunkSize);
			await prisma.performanceMetric.createMany({ data: chunk });
		}
	}

	console.log(`✅ Created ${metricRows.length} performance metric rows`);

	console.log("\n✨ Database seeded successfully!");
	console.log("\n📊 Summary (Large Fulfillment Operation):");
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
	console.log(
		`   - Task Assignments: ${createdTasks.length} (${activeTaskCount} active) — ~6 tasks per shift`
	);
	console.log(`   - Time Logs: ${timeLogRows.length} (${activeTimeLogCount} active)`);
	console.log(`   - Performance Metrics: ${metricRows.length}`);
	console.log(`   - Users: 2 (Admin, Manager)`);
	console.log("\n🔑 Login Information:");
	console.log(`   - Admin: admin@warehouse.com`);
	console.log(`   - Manager: manager@warehouse.com`);
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
