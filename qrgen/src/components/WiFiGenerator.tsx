"use client";

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Wifi, Lock, Eye, EyeOff, Download, Settings2, Shield } from 'lucide-react';

export default function WiFiGenerator() {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const escapeString = (str: string) => str.replace(/([\\;:,])/g, "\\$1");

    const generateWiFiString = () => {
        const escapedSsid = escapeString(ssid);
        const escapedPassword = escapeString(password);
        const enc = encryption === 'nopass' ? 'nopass' : encryption;
        return `WIFI:S:${escapedSsid};T:${enc};P:${escapedPassword};H:${hidden};;`;
    };

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `wifi-qr-${ssid || 'network'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const qrString = generateWiFiString();

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 mx-auto">
            {/* Form Section */}
            <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Wifi className="w-6 h-6 text-indigo-600" />
                    Network Details
                </h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Network Name (SSID)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Wifi className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="My Awesome WiFi"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Security / Encryption</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                value={encryption}
                                onChange={(e) => setEncryption(e.target.value)}
                                className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="WPA">WPA/WPA2/WPA3</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </div>
                    </div>

                    {encryption !== 'nopass' && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter secure password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <label className="relative flex items-center cursor-pointer">
                            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-slate-400" />
                            Hidden Network
                        </span>
                    </div>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center bg-slate-50">
                <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-slate-800">Scan to Connect</h3>
                    <p className="text-slate-500 text-sm mt-1">Point your camera at the code</p>
                </div>

                <div
                    ref={qrRef}
                    className="bg-white p-4 rounded-3xl shadow-md border border-slate-100 transition-all hover:shadow-lg flex items-center justify-center"
                >
                    <QRCodeCanvas
                        value={qrString}
                        size={240}
                        level={"H"}
                        includeMargin={true}
                        bgColor={"#ffffff"}
                        fgColor={"#0f172a"}
                    />
                </div>

                <button
                    onClick={handleDownload}
                    disabled={!ssid}
                    className="mt-10 w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    Download QR Code
                </button>
                {!ssid && (
                    <p className="text-xs text-rose-500 mt-3 font-medium">Please enter a Network Name to download</p>
                )}
            </div>
        </div>
    );
}
