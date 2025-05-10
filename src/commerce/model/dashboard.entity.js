export class Dashboard {
    constructor(weekNumbers, totalIncome, totalExpense, totalProfit) {
        this.weekNumbers = weekNumbers;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.totalProfit = totalProfit;
    }

    static fromDisplayableDashboard(displayableDashboard) {
        return new Dashboard(
            displayableDashboard.weekNumbers,
            displayableDashboard.totalIncome,
            displayableDashboard.totalExpense,
            displayableDashboard.totalProfit
        );
    }

    static toDisplayableDashboard(dashboard) {
        return {
            weekNumbers: dashboard.weekNumbers,
            totalIncome: dashboard.totalIncome,
            totalExpense: dashboard.totalExpense,
            totalProfit: dashboard.totalProfit
        };
    }
}