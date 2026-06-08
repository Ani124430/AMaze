const BASE = "http://localhost:5000"; 

async function req(method, path, body, token) {
    const headers = {"Content-Type": "application/json"};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, {
        method, headers, 
        body: body ? JSON.stringify(body) : undefined, 
    });
    if (res.status === 204) return null; 
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Грешка от сървъра");
    return data; 
}

export const api = {
    signUp: (username, password) => req("POST", "/auth/sign-up", {username, password}),
    signIn: (username, password) => req("POST", "/auth/sign-in", {Username, password}),
    getHabits: (token) => req("GET", "/habits/", null, token),
    createHabit: (token, name, description) => req("POST", "/habits/", {name, description}, token ),
    updateHabit: (token, id, data) => req("PATCH", `/habits/${id}`, data, token),
    deleteHabit: (token, id) => req("DELETE", `/habits/${id}`, null, token ), 
    getAllStats: (token) => req("GET", "/habits/stats", null, token),
    logHabit: (token, habit_id) => req("POST", "/habit-logs/", {habit_id}, token), 
    getLogs: (token, habit_id, days=30) => req("GET", `/habit-logs/?habit_id=${habit_id}&days=${days}`, null, token),
};