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
		hireDate.setDate(seedNow.getDate() - (index * 17) % (365 * 3));

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
	// Create task assignments with broad historical coverage and active in-progress work
	console.log("📋 Creating sample task assignments...");
	const now = new Date();
	const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE");
	const taskTypeByStation = new Map(taskTypes.map((taskType) => [taskType.stationId, taskType]));

	const assignmentRows: Array<{
		employeeId: string;
		taskTypeId: string;
		startTime: Date;
		endTime: Date | null;
		unitsCompleted: number | null;
		notes: string;
	}> = [];

	for (let dayOffset = 1; dayOffset <= 365 * 3; dayOffset++) {
		for (const [employeeIndex, employee] of activeEmployees.entries()) {
			if ((dayOffset + employeeIndex) % 9 === 0) continue;

			const stationTaskType = employee.defaultStationId
				? taskTypeByStation.get(employee.defaultStationId)
				: null;
			const fallbackTaskType = taskTypes[(employeeIndex + dayOffset) % taskTypes.length];
			const selectedTaskType = stationTaskType ?? fallbackTaskType;

			const shiftDate = new Date(now);
			shiftDate.setDate(now.getDate() - dayOffset);
			const shiftStartHour = [6, 14, 22][employeeIndex % 3];
			shiftDate.setHours(shiftStartHour, ((employeeIndex * 7 + dayOffset) % 4) * 15, 0, 0);

			const segmentCount = (dayOffset + employeeIndex) % 5 === 0 ? 2 : 1;
			let segmentStart = new Date(shiftDate);

			for (let segment = 0; segment < segmentCount; segment++) {
				const durationHours =
					segmentCount === 2 && segment === 0 ? 4.0 : 6.8 + ((dayOffset + segment) % 3) * 0.35;
				const endTime = new Date(segmentStart.getTime() + durationHours * 60 * 60 * 1000);
				const unitsBase = 140 + ((employeeIndex * 19 + dayOffset * 11 + segment * 7) % 230);

				assignmentRows.push({
					employeeId: employee.id,
					taskTypeId: selectedTaskType.id,
					startTime: segmentStart,
					endTime,
					unitsCompleted: unitsBase,
					notes: `Historical shift d-${dayOffset} segment ${segment + 1}`,
				});

				segmentStart = new Date(endTime.getTime() + 30 * 60 * 1000);
			}
		}
	}

	const activeAssignmentsTarget = Math.min(activeEmployees.length, 26);
	const activeAssignmentsToCreate = activeEmployees
		.slice(0, activeAssignmentsTarget)
		.map((employee, index) => {
		const stationTaskType = employee.defaultStationId
			? taskTypeByStation.get(employee.defaultStationId)
			: null;
		const selectedTaskType = stationTaskType ?? taskTypes[index % taskTypes.length];
		const startedMinutesAgo = 35 + index * 9;

		return {
			employeeId: employee.id,
			taskTypeId: selectedTaskType.id,
			startTime: new Date(now.getTime() - startedMinutesAgo * 60 * 1000),
			endTime: null,
			unitsCompleted: 22 + index * 5,
			notes: `Active assignment in progress at ${selectedTaskType.name}`,
		};
		});

	assignmentRows.push(...activeAssignmentsToCreate);

	const createdAssignments = await prisma.taskAssignment.createMany({
		data: assignmentRows,
	});

	const activeAssignmentCount = assignmentRows.filter(
		(assignment) => assignment.endTime === null
	).length;
	const historicalAssignmentCount = assignmentRows.length - activeAssignmentCount;

	console.log(
		`✅ Created ${createdAssignments.count} task assignments (${activeAssignmentCount} active, ${historicalAssignmentCount} historical)`
	);

	// Create historical performance metrics for analytics charts
	console.log("📈 Creating performance metrics history...");
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

	for (let dayOffset = 0; dayOffset < 365 * 3; dayOffset++) {
		const metricDate = new Date();
		metricDate.setDate(metricDate.getDate() - dayOffset);
		metricDate.setHours(0, 0, 0, 0);

		for (const [employeeIndex, employee] of activeEmployeesForMetrics.entries()) {
			if (!employee.defaultStationId) continue;

			// Introduce realistic attendance variability
			if ((dayOffset + employeeIndex) % 10 === 0) continue;

			const station = stations.find((s) => s.id === employee.defaultStationId);
			const stationName = station?.name ?? "PICKING";
			const baselineRate = stationBaselineRate.get(stationName) ?? 24;

			const dailyVariation = ((dayOffset * 3 + employeeIndex * 5) % 11) - 5; // -5..+5
			const hoursWorked = Number((7.3 + ((dayOffset + employeeIndex) % 5) * 0.4).toFixed(2));
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
	console.log(`   - Task Types: ${taskTypes.length}`);
	console.log(
		`   - Task Assignments: ${createdAssignments.count} (${activeAssignmentCount} active, ${historicalAssignmentCount} historical)`
	);
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
