import React, { useState, useEffect } from 'react';
import { fetchDatabases, fetchTables, descTable, executeQuery, fetchAiQuery } from '../controllers/api';
import { Layout, Select, Button, Checkbox, Input, Typography, Spin, Table, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Content, Header, Footer, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const MySqlDashboard = (props) => {


    const { databases, 
            setDatabases, 
            selectedDatabase,
            setSelectedDatabase,
            tables,
            setTables,
            selectedTable,
            setSelectedTable,
            query,
            setQuery,
            result,
            setResult,
            aiSelectedTables,
            setAiSelectedTables,
            aiUserInput,
            setAiUserInput,
            aiResponse,
            setAiResponse,
        } = props;

    const [loadingDatabases, setLoadingDatabases] = useState(false);
    const [loadingTables, setLoadingTables] = useState(false);
    const [loadingQuery, setLoadingQuery] = useState(false);
    const [loadingDescTable, setLoadingDescTable] = useState(false);
    const [loadingAiQuery, setLoadingAiQuery] = useState(false);


    // Fetch databases data on component mount
    useEffect(() => {
        const fetchDatabasesData = async () => {
            setLoadingDatabases(true);
            const databasesData = await fetchDatabases();
            setDatabases(databasesData);
            setLoadingDatabases(false);
        };
        fetchDatabasesData();
    }, []);

    // Fetch tables data when a database is selected
    useEffect(() => {
        const fetchTablesData = async () => {
            setLoadingTables(true);
            const tablesData = await fetchTables(selectedDatabase);
            setTables(tablesData);
            setAiSelectedTables([]);
            setLoadingTables(false);
        };

        if (selectedDatabase) {
            fetchTablesData();
        }
    }, [selectedDatabase]);

    // Execute query handler
    const executeQueryHandler = async () => {
        setLoadingQuery(true);
        const queryResult = await executeQuery(selectedDatabase, query);
        setResult(queryResult);
        setLoadingQuery(false);
    };

    // Describe table handler
    const descTableHandler = async () => {
        setLoadingDescTable(true);
        const tableData = await descTable(selectedDatabase, selectedTable, document.getElementById('detailedDescription').checked);
        setResult(tableData);
        setLoadingDescTable(false);
    };

    // Handle table selection for AI query
    const handleTableSelection = (table) => {
        if (aiSelectedTables.includes(table)) {
            setAiSelectedTables(aiSelectedTables.filter((t) => t !== table));
        } else {
            setAiSelectedTables([...aiSelectedTables, table]);
        }
    };

    // Handle AI query submission
    const handleAiQuerySubmission = async () => {
        setLoadingAiQuery(true);
        const aiResponse = await fetchAiQuery(aiUserInput, selectedDatabase, aiSelectedTables);
        setAiResponse(aiResponse);
        setLoadingAiQuery(false);
    };

    const columns = result.length > 0 ? Object.keys(result[0]).map((key) => ({ title: key, dataIndex: key, key })) : [];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Sider width={500} style={{ background: '#fff', padding: '16px' }}>
                    <div>
                        <label>Select Database:</label>
                        <Select value={selectedDatabase} onChange={(value) => setSelectedDatabase(value)}>
                            <Option value="">-- Select Database --</Option>
                            {loadingDatabases ? (
                                <Option value="" disabled>Loading...</Option>
                            ) : (
                                databases.map((database) => (
                                    <Option key={database} value={database}>
                                        {database}
                                    </Option>
                                ))
                            )}
                        </Select>
                    </div>
                    {selectedDatabase && (
                        <div style={{ marginTop: '16px' }}>
                            <label>Select Table:</label>
                            <Select value={selectedTable} onChange={(value) => setSelectedTable(value)}>
                                <Option value="">-- Select Table --</Option>
                                {loadingTables ? (
                                    <Option value="" disabled>Loading...</Option>
                                ) : (
                                    tables.map((table) => (
                                        <Option key={table} value={table}>
                                            {table}
                                        </Option>
                                    ))
                                )}
                            </Select>
                        </div>
                    )}
                    {selectedDatabase && selectedTable && (
                        <div style={{ marginTop: '16px' }}>
                            <Button onClick={descTableHandler} disabled={loadingDescTable}>
                                {loadingDescTable ? <Spin /> : 'Describe Table'}
                            </Button>
                            <Checkbox id="detailedDescription">detailed</Checkbox>
                        </div>
                    )}
                    {selectedDatabase && (
                        <div style={{ marginTop: '16px' }}>
                            <label>Enter Query:</label>
                            <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button onClick={executeQueryHandler} disabled={loadingQuery}>
                                {loadingQuery ? <Spin /> : 'Execute'}
                            </Button>
                        </div>
                    )}
                </Sider>
                <Layout>
                    <Content style={{ padding: '16px' }}>
                        <div>
                            <Title level={3}>AI Interface</Title>
                        </div>
                        {selectedDatabase && (
                            <div style={{ marginTop: '16px' }}>
                                <Title level={4}>Tables:</Title>
                                {loadingTables ? (
                                    <Spin />
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                        {tables.map((table) => (
                                            <div key={table}>
                                                <Checkbox
                                                    id={table}
                                                    checked={aiSelectedTables.includes(table)}
                                                    onChange={() => handleTableSelection(table)}
                                                />
                                                <label htmlFor={table}>{table}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedDatabase && (
                            <div style={{ marginTop: '16px' }}>
                                <label>AI User Input:</label>
                                <Input type="text" value={aiUserInput} onChange={(e) => setAiUserInput(e.target.value)} />
                                <Button onClick={handleAiQuerySubmission} disabled={loadingAiQuery}>
                                    {loadingAiQuery ? <Spin /> : 'Submit'}
                                </Button>
                            </div>
                        )}
                        <div style={{ marginTop: '16px' }}>
                            <Title level={4}>AI Response:</Title>
                            <TextArea value={aiResponse} defaultValue="nothing here yet..." id="aiResponseTextarea" />
                            <Button onClick={() => setQuery(aiResponse)}>
                                Use this
                            </Button>
                        </div>
                    </Content>
                </Layout>
            </Layout>
            {result && (
                <div style={{ flex: '1 0 auto', overflow: 'auto', padding: '16px', borderTop: '1px solid #ccc', width: '100%' }}>
                    <Title level={4}>Query Result:</Title>
                    <Table dataSource={result} columns={columns} />
                </div>
            )}
        </Layout>
    );
};

export default MySqlDashboard;
