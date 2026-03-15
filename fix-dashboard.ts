import fs from 'fs';
import path from 'path';

const file = 'apps/web/src/routes/executive/analytics/analytics-dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the badge logic in ProductivityEmployeeTableContent
const tableOldFunc = `	return (
		<HardwareCard>
			<HardwareCardHeader title="Employee Productivity Rankings" />
			<HardwareCardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs uppercase bg-ui-100 text-ui-600">
							<tr>
								<th className="px-4 py-3 font-medium">Employee</th>
								<th className="px-4 py-3 font-medium">Station</th>
								<th className="px-4 py-3 font-medium text-right">Avg U/H</th>
								<th className="px-4 py-3 font-medium">Vs Industry</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-ui-100">
							{employeeProductivity.length > 0 ? (
								employeeProductivity.map((employee, index) => (
									<tr key={index} className="hover:bg-ui-50/50 transition-colors">
										<td className="px-4 py-3 font-medium text-ui-900">{employee.employee}</td>
										<td className="px-4 py-3">
											<Badge variant="outline" size="sm">
												{employee.station}
											</Badge>
										</td>
										<td className="px-4 py-3 text-right font-medium text-ui-900">
											{employee.value}
										</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												{employee.value >= benchmarkData.productivity.top10Percent ? (
													<Badge variant="brand" size="sm">
														Top 10%
													</Badge>
												) : employee.value >= benchmarkData.productivity.industryAvg ? (
													<Badge variant="success" size="sm">
														Above Avg
													</Badge>
												) : (
													<Badge variant="warning" size="sm">
														Below Avg
													</Badge>
												)}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="px-4 py-8 text-center text-ui-500">
										No productivity ranking data available for this period.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</HardwareCardContent>
		</HardwareCard>
	);`;

const tableNewFunc = `	return (
		<HardwareCard>
			<HardwareCardHeader title="Employee Productivity Rankings" />
			<HardwareCardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs uppercase bg-ui-100 text-ui-600">
							<tr>
								<th className="px-4 py-3 font-medium">Employee</th>
								<th className="px-4 py-3 font-medium">Station</th>
								<th className="px-4 py-3 font-medium text-right">Normalized Score</th>
								<th className="px-4 py-3 font-medium">Vs Station Avg</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-ui-100">
							{employeeProductivity.length > 0 ? (
								employeeProductivity.map((employee, index) => (
									<tr key={index} className="hover:bg-ui-50/50 transition-colors">
										<td className="px-4 py-3 font-medium text-ui-900">{employee.employee}</td>
										<td className="px-4 py-3">
											<Badge variant="outline" size="sm">
												{employee.station}
											</Badge>
										</td>
										<td className="px-4 py-3 text-right font-medium text-ui-900">
											{employee.value}
										</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												{employee.value >= 110 ? (
													<Badge variant="brand" size="sm">
														Top Performer
													</Badge>
												) : employee.value >= 100 ? (
													<Badge variant="success" size="sm">
														Above Avg
													</Badge>
												) : (
													<Badge variant="warning" size="sm">
														Below Avg
													</Badge>
												)}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="px-4 py-8 text-center text-ui-500">
										No productivity ranking data available for this period.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</HardwareCardContent>
		</HardwareCard>
	);`;

code = code.replace(tableOldFunc, tableNewFunc);
fs.writeFileSync(file, code);
console.log("Updated dashboard successfully");
