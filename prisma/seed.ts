import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seed...");

	// Clear existing data
	console.log("📦 Clearing existing data...");
	await prisma.timeLog.deleteMany();
	await prisma.taskAssignment.deleteMany();
	await prisma.performanceMetric.deleteMany();
	await prisma.taskType.deleteMany();
	await prisma.session.deleteMany();
	await prisma.oAuthAccount.deleteMany();
	await prisma.user.deleteMany();
	await prisma.employee.deleteMany();
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

	// Create Employees
	console.log("👥 Creating employees...");
	const employees = await Promise.all([
		// Active employees
		prisma.employee.create({
			data: {
				name: "John Smith",
				email: "john.smith@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP001",
				phoneNumber: "555-0101",
				hireDate: new Date("2023-01-15"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[0].id, // PICKING
			},
		}),
		prisma.employee.create({
			data: {
				name: "Sarah Johnson",
				email: "sarah.johnson@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP002",
				phoneNumber: "555-0102",
				hireDate: new Date("2023-02-20"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[1].id, // PACKING
			},
		}),
		prisma.employee.create({
			data: {
				name: "Michael Chen",
				email: "michael.chen@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP003",
				phoneNumber: "555-0103",
				hireDate: new Date("2023-03-10"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[2].id, // FILLING
			},
		}),
		prisma.employee.create({
			data: {
				name: "Emily Davis",
				email: "emily.davis@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP004",
				phoneNumber: "555-0104",
				hireDate: new Date("2023-04-05"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[3].id, // RECEIVING
			},
		}),
		prisma.employee.create({
			data: {
				name: "David Martinez",
				email: "david.martinez@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP005",
				phoneNumber: "555-0105",
				hireDate: new Date("2023-05-12"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[4].id, // SHIPPING
			},
		}),
		prisma.employee.create({
			data: {
				name: "Jennifer Wilson",
				email: "jennifer.wilson@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP006",
				phoneNumber: "555-0106",
				hireDate: new Date("2023-06-18"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[5].id, // QUALITY
			},
		}),
		prisma.employee.create({
			data: {
				name: "Robert Taylor",
				email: "robert.taylor@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP007",
				phoneNumber: "555-0107",
				hireDate: new Date("2023-07-22"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[6].id, // INVENTORY
			},
		}),
		prisma.employee.create({
			data: {
				name: "Lisa Anderson",
				email: "lisa.anderson@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP008",
				phoneNumber: "555-0108",
				hireDate: new Date("2023-08-14"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[0].id, // PICKING
			},
		}),
		prisma.employee.create({
			data: {
				name: "James Thompson",
				email: "james.thompson@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP009",
				phoneNumber: "555-0109",
				hireDate: new Date("2023-09-30"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[1].id, // PACKING
			},
		}),
		prisma.employee.create({
			data: {
				name: "Maria Garcia",
				email: "maria.garcia@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP010",
				phoneNumber: "555-0110",
				hireDate: new Date("2023-10-25"),
				status: "ACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[2].id, // FILLING
			},
		}),
		// Employee on leave
		prisma.employee.create({
			data: {
				name: "William Brown",
				email: "william.brown@warehouse.com",
				pinHash: samplePinHash,
				employeeCode: "EMP011",
				phoneNumber: "555-0111",
				hireDate: new Date("2022-11-10"),
				status: "ON_LEAVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
				defaultStationId: stations[3].id, // RECEIVING
			},
		}),
		// Inactive employee
		prisma.employee.create({
			data: {
				name: "Patricia Moore",
				email: "patricia.moore@warehouse.com",
				employeeCode: "EMP012",
				phoneNumber: "555-0112",
				hireDate: new Date("2022-05-01"),
				status: "INACTIVE",
				dailyHoursLimit: 8.0,
				weeklyHoursLimit: 40.0,
			},
		}),
	]);

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
				estimatedMinutesPerUnit: 2.5,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Pack Orders",
				stationId: stations[1].id, // PACKING
				description: "Pack picked items into shipping boxes",
				estimatedMinutesPerUnit: 3.0,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Fill Containers",
				stationId: stations[2].id, // FILLING
				description: "Fill product containers and bottles",
				estimatedMinutesPerUnit: 1.5,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Receive Shipment",
				stationId: stations[3].id, // RECEIVING
				description: "Process incoming shipments",
				estimatedMinutesPerUnit: 10.0,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Load Truck",
				stationId: stations[4].id, // SHIPPING
				description: "Load packages onto delivery trucks",
				estimatedMinutesPerUnit: 5.0,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Quality Inspection",
				stationId: stations[5].id, // QUALITY
				description: "Inspect products for quality standards",
				estimatedMinutesPerUnit: 4.0,
				isActive: true,
			},
		}),
		prisma.taskType.create({
			data: {
				name: "Stock Count",
				stationId: stations[6].id, // INVENTORY
				description: "Count and verify inventory levels",
				estimatedMinutesPerUnit: 8.0,
				isActive: true,
			},
		}),
	]);

	console.log(`✅ Created ${taskTypes.length} task types`);

	console.log("\n✨ Database seeded successfully!");
	console.log("\n📊 Summary:");
	console.log(`   - Stations: ${stations.length}`);
	console.log(`   - Employees: ${employees.length}`);
	console.log(`   - Task Types: ${taskTypes.length}`);
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
