import { ExceptionQueueView } from "./client";
import { getManagerExceptionQueue } from "./actions";

export default async function Component() {
	const queueData = await getManagerExceptionQueue();

	return <ExceptionQueueView initialData={queueData} />;
}
