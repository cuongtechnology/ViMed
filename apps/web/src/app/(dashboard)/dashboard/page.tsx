"use client";

import { useEffect, useMemo, useState } from "react";

type DashboardMetrics = {
  appointmentsToday: number;
  customersToday: number;
  todayRevenue: number;
  waitingTickets: number;
};

const defaultMetrics: DashboardMetrics = {
  appointmentsToday: 0,
  customersToday: 0,
  todayRevenue: 0,
  waitingTickets: 0,
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch("/api/dashboard/metrics", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as DashboardMetrics;
        setMetrics({
          appointmentsToday: data.appointmentsToday ?? 0,
          customersToday: data.customersToday ?? 0,
          todayRevenue: Number(data.todayRevenue ?? 0),
          waitingTickets: data.waitingTickets ?? 0,
        });
      } catch {
        setMetrics(defaultMetrics);
      }
    };

    loadMetrics();
  }, []);

  const revenueText = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(metrics.todayRevenue),
    [metrics.todayRevenue],
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</h3>
          <p className="mt-2 text-3xl font-bold text-cyan-600">{metrics.appointmentsToday}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Khách hàng mới</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{metrics.customersToday}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Doanh thu ngày</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{revenueText}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Ticket chờ</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">{metrics.waitingTickets}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Chào mừng đến với Việt Care CMS</h2>
        <p className="text-gray-600">
          Hệ thống quản lý phòng khám/bệnh viện đa khoa. Chọn chức năng từ menu bên trái để bắt đầu.
        </p>
      </div>
    </div>
  );
}
