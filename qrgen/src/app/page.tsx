import WiFiGenerator from "@/components/WiFiGenerator";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                    WiFi QR Generator
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Create a scannable QR code for your WiFi network so guests can connect instantly without typing passwords.
                </p>
            </div>

            <WiFiGenerator />

            <footer className="mt-16 text-center text-sm text-slate-500">
                <p>No data is saved or sent to any server. QR codes are generated entirely within your browser.</p>
            </footer>
        </main>
    );
}
