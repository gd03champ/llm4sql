import './App.css';
import React, { useState, useEffect } from 'react';
import MySqlDashboard from './pages/mySqlDashboard';

import { DatabaseFilled, TableOutlined, FundViewOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


function App() {

  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  const [aiSelectedTables, setAiSelectedTables] = useState([]);
  const [aiUserInput, setAiUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    getItem('Databases', '1', <DatabaseFilled />, 
      databases.map(database => getItem(database, database, null, null, 'database'))),
    getItem('Tables', '2', <TableOutlined />, 
      tables.map(table => getItem(table, table, null, null, 'table'))),
    getItem('Views', '3', <FundViewOutlined />, [
      getItem('View 1', '31'),
      getItem('View 2', '32'),
      getItem('View 3', '33'),
    ]),
  ];

  const handleDatabaseClick = async (database) => {
    await setSelectedDatabase(database);
  };

  return (
    <Layout className="layout">
      <Header>
        <div id='logo' className="logo" style={{ width: '120px', height: '31px', background: '#333', borderRadius: '6px', margin: '16px 24px 16px 0', float: 'left' }}></div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">About</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>

        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={menuItems}
              onClick={handleDatabaseClick}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>

              <MySqlDashboard
                databases={databases}
                setDatabases={setDatabases}
                selectedDatabase={selectedDatabase}
                setSelectedDatabase={setSelectedDatabase}
                tables={tables}
                setTables={setTables}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                query={query}
                setQuery={setQuery}
                result={result}
                setResult={setResult}
                aiSelectedTables={aiSelectedTables}
                setAiSelectedTables={setAiSelectedTables}
                aiUserInput={aiUserInput}
                setAiUserInput={setAiUserInput}
                aiResponse={aiResponse}
                setAiResponse={setAiResponse}
              />

              Main Content
            </div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        SQLCoder Automate ©2024 Created by gd03champ
      </Footer>
    </Layout>
  );
}
{/* <MySqlDashboard /> */ }
export default App;
