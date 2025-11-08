import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header userName={null} userRole={null} />
			{children}
			<Footer />
		</>
	);
}
