import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchDatabases = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/databases`);
        return response.data;
    } catch (error) {
        console.error('Error fetching databases:', error);
        throw error;
    }
};

export const fetchTables = async (database) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables/${database}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tables for database ${database}:`, error);
        throw error;
    }
};

export const descTable = async (database, table, isDetailed) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tabledata/${database}/${table}?describe=${isDetailed}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tables for database ${database}:`, error);
        throw error;
    }
};

export const executeQuery = async (database, query) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/query/${database}`, { myQuery: query });
        return response.data;
    } catch (error) {
        console.error(`Error executing query for database ${database}:`, error);
        throw error;
    }
};

export const fetchAiQuery = async (input, database, tables) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/aiquery`, { input, database, tables });
        return response.data;
    } catch (error) {
        console.error('Error fetching AI query:', error);
        throw error;
    }
};
