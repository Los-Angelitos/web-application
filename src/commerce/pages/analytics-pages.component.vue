<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="analytics-page">
    <div class="content-container">
      <div class="page-header">
        <h1>{{this.hotelName}}</h1>
        <p class="subtitle">{{ i18n.global.t('analytics.overview')}}</p>

        <div class="tabs">
          <div
              v-for="tab in tabsWithLabels"
              :key="tab.id"
              :class="['tab', { active: activeTab === tab.id }]"
              @click="changeTab(tab.id)"
          >
            {{ tab.label }}
          </div>
        </div>

      </div>

      <div class="chart-container" v-if="activeDashboard.length">
        <LineChart
            :incomes="activeDashboard.map(e => e.totalIncome)"
            :expenses="activeDashboard.map(e => e.totalExpense)"
            :labels="formattedLabels"
            :t="i18n.global.t"
        />
      </div>
      <div v-else class="loading">{{ i18n.global.t('analytics.loading')}}</div>
    </div>
  </div>
</template>

<script>
import { DashboardApiService } from "../services/dashboard-api.service.js";
import { Dashboard } from "../model/dashboard.entity.js";
import { HotelsApiService } from "../../shared/services/hotels-api.service.js";
import LineChart from "../components/line-chart.vue";
import {Hotel} from "../../shared/model/hotel.entity.js";
import MainPageNavigation from "../../organizational-management/components/main-page-navigation.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import i18n from "../../i18n.js";
import { useAuthenticationStore } from '/src/iam/services/authentication.store.js';
const userId = useAuthenticationStore.state.userId;
export default {
  name: "AnalyticsPage",
  components: {MainPageNavigation, LineChart },
  data() {
    return {
      hotelName: '',
      hotelId: null,
      userId: userId,
      dashboardApi: new DashboardApiService(),
      hotelApi: new HotelsApiService(),
      dashboard: [],
      monthlyDashboard: [],
      navigationItems: [
        {id: "overview", label: "Overview", path: "/home/hotel/1/overview", icon: OverviewIcon, isActive: false},
        {id: "analytics", label: "Analytics", path: "/home/hotel/1/analytics", icon: AnalyticsIcon, isActive: true},
        {id: "providers", label: "Providers", path: "/home/hotel/1/providers", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "/home/hotel/1/inventory", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "/home/hotel/1/rooms", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "/home/hotel/1/organization", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "/home/hotel/1/set-up/devices", icon: DevicesIcon, isActive: false}
      ],
      activeTab: 'weekly',
      tabs: [
        { id: 'weekly' },
        { id: 'monthly' }
      ]
    };
  },

  computed: {
    i18n() {
      return i18n
    },
    tabsWithLabels() {
      return this.tabs.map(tab => {
        if (tab.id === 'weekly') {
          return { ...tab, label: this.i18n.global.t('analytics.line-chart.weekly') };
        }
        if (tab.id === 'monthly') {
          return { ...tab, label: this.i18n.global.t('analytics.line-chart.monthly') };
        }
        return tab;
      });
    },
    formattedLabels() {
      if (this.activeTab === 'weekly') {
        return this.dashboard.map((entry) => {
          const start = new Date(2025, 0, 1 + entry.weekNumbers * 7);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);

          const format = (d) =>
              d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

          return `${format(start)} - ${format(end)}`;
        });
      }

      if (this.activeTab === 'monthly') {
        return this.dashboard.map((entry) => {
          const start = new Date(2025, 0, 1 + entry.weekNumbers * 28);
          const end = new Date(start);
          end.setDate(start.getDate() + 27);

          const format = (d) =>
              d.toLocaleDateString("en-GB", { month: "short" });

          return `${format(end)}`;
        });
      }

      const months = Array(12).fill(0).map((_, i) =>
          new Date(2025, i).toLocaleDateString("en-GB", { month: "short" })
      );

      const counts = Array(12).fill(0); // totalIncome por mes

      this.monthlyDashboard.forEach((entry) => {
        const start = new Date(2025, 0, 1 + entry.weekNumbers * 7);
        const daysInWeek = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          return d.getMonth(); // 0 = Jan, 11 = Dec
        });

        const monthWithMostDays = daysInWeek
            .reduce((acc, m) => {
              acc[m] = (acc[m] || 0) + 1;
              return acc;
            }, {});

        const assignedMonth = Object.keys(monthWithMostDays)
            .map(Number)
            .reduce((a, b) => monthWithMostDays[a] >= monthWithMostDays[b] ? a : b);

        counts[assignedMonth] += entry.totalIncome;
      });

      return months;
    },
    activeDashboard() {
      return this.activeTab === 'monthly' ? this.monthlyDashboard : this.dashboard;
    }
  },

  methods: {
    async fetchWeeklyData() {
      try {
        const res = await this.dashboardApi.getWeeklyData(this.hotelId);
        console.log("Respuesta del dashboard:", res.data);

        this.dashboard = res.data.map(entry =>
            Dashboard.fromDisplayableDashboard(entry)
        );
      } catch (error) {
        console.error("Error fetching weekly dashboard data:", error);
        this.dashboard = [];
      }
    },

    async fetchMonthlyData() {
      try {
        const res = await this.dashboardApi.getMonthlyData(this.hotelId);
        console.log("Respuesta del dashboard:", res.data);

        this.monthlyDashboard = res.data.map(entry =>
            Dashboard.fromDisplayableDashboard(entry)
        );
      } catch (error) {
        console.error("Error fetching monthly dashboard data:", error);
        this.monthlyDashboard = [];
      }
    },

    changeTab(tabId) {
      this.activeTab = tabId;
      if (tabId === 'monthly' && this.monthlyDashboard.length === 0) {
        this.fetchMonthlyData();
      }
    }
  },

  async created() {
    try {
      const hotel = await HotelsApiService.getHotelByOwnerId(this.userId);

      this.hotelName = hotel.name;
      this.hotelId = hotel.id;

      try {
        const res = await this.dashboardApi.getWeeklyData(this.hotelId);
        this.dashboard = res.data.map(entry =>
            Dashboard.fromDisplayableDashboard(entry)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        this.dashboard = [];
      }

    } catch (error) {
      console.error("Error fetching hotel:", error);
      this.hotelName = "Hotel Not Found";
    }

  }
};
</script>

<style scoped>
.analytics-page {
  min-height: 100vh;
  padding: 0 2rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.page-header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0 1.5rem 0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--gray-extra-light-color, #e0e0e0);
}

.tab {
  padding: 0.5rem 1rem;
  margin-right: 1.5rem;
  cursor: pointer;
  color: #666;
  position: relative;
}

.tab.active {
  color: #0066cc;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #0066cc;
}

.chart-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-top: 2rem;
  min-height: 600px;
  height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.period-selector {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
}

.period-selector i {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.legend {
  display: flex;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  font-size: 0.8rem;
  color: #666;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.color-indicator.current {
  background-color: #0066cc;
}

.color-indicator.goal {
  background-color: #ff9999;
}

.chart {
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
  padding-top: 0.5rem;
}

.date-range {
  text-align: center;
}

.loading, .error, .no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  color: #666;
  font-size: 0.9rem;
}

.error {
  color: #cc0000;
}

.data-table {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

td {
  color: #555;
  font-size: 0.85rem;
}
</style>