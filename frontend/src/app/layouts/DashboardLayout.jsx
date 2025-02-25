import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import HeaderComponent from '../components/header/header';
import FooterComponent from '../components/footer/footer';
import { Link, useLocation, useParams } from 'react-router-dom';

const DashboardLayout = ({
  children,
  showBreadcrumbs = true,
  showSider = false,
  patientId,
  menu,
}) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const params = useParams();

  const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/dashboard/add-patient': 'Add Patient',
    '/dashboard/patients': 'Patients',
    '/dashboard/appointment': 'Appointment',
    '/dashboard/patients/:id/details': 'Patients Detail',
    '/dashboard/test-result': 'Test Result',
    '/dashboard/scan-result': 'Scan Result',
  };

  if (Object.entries(params).length >= 0) {
    breadcrumbNameMap[`/dashboard/patients/${params.id}`] = `${params.id} Patient Detail`;
    breadcrumbNameMap[`/dashboard/patients/${params.id}/edit`] = `Edit`;
  }

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url] ?? ''}</Link>,
    };
  });

  const breadcrumbItems = [
    // INFO: Add default Here
  ].concat(extraBreadcrumbItems);

  const items = [
    {
      label: (
        <Link to={`/dashboard/patients/${params.id ? params.id : patientId}`}>Patient details</Link>
      ),
      key: 'detail',
    },
    {
      label: (
        <Link to={`/dashboard/appointment/${params.id ? params.id : patientId}`}>Appointment</Link>
      ),
      key: 'appointment',
    },
    {
      label: (
        <Link to={`/dashboard/medication/${params.id ? params.id : patientId}`}>Medication</Link>
      ),
      key: 'medication',
    },
    {
      label: (
        <Link to={`/dashboard/test-result/${params.id ? params.id : patientId}`}>Test Result</Link>
      ),
      key: 'test',
    },
    {
      label: (
        <Link to={`/dashboard/scan-result/${params.id ? params.id : patientId}`}>Scan Result</Link>
      ),
      key: 'scan',
    },
  ];
  return (
    <main className="app_dashboard">
      <HeaderComponent />
      <Layout>
        {showSider && (
          <Sider width={200}>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              items={items}
              selectedKeys={[menu]}
            />
          </Sider>
        )}
        <Layout className="dashboard_layout__inner">
          {showBreadcrumbs && (
            <>
              <Breadcrumb
                className="dashboard_layout__breadcrumbs"
                items={breadcrumbItems}></Breadcrumb>
            </>
          )}
          <Content className="dashboard_layout__content">{children}</Content>
        </Layout>
      </Layout>
      <FooterComponent />
    </main>
  );
};

export default DashboardLayout;
