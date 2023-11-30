import { UserOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Space,
  Typography,
  Table,
  Button,
  DatePicker,
  Form,
  Modal,
  Input,
  Drawer,
} from 'antd';
import styles from '../testResult/testResult.module.css';
import { Link, useParams } from 'react-router-dom';
import {
  addTestResults,
  deleteTestResults,
  getPatientByID,
  getTestResults,
} from '../../../core/api/query';

const PatientMedication = () => {
  const { id } = useParams();
  const { Text, Title } = Typography;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [appId, setAppId] = useState(3);
  const [data, setData] = useState([]);
  const [patientsData, setPatientDetails] = useState({});
  const [open, setOpen] = useState(false);
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/test-result/${id}/edit/${record.id}`}>Edit</Link>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  //Delete result
  const handleDelete = (key) => {
    confirm({
      title: 'Are you sure delete this test result?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        const deletres = await deleteTestResults(key);
        if (deletres.data.success === true) {
          const newData = data.filter((item) => item.id !== key);
          setData(newData);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onFinish = async (values) => {
    values['date'] = values.date.format('DD-MM-YYYY');
    const newData = {
      type: `${values.date}`,
      resultFile: `${values.result}`,
      note: `${values.note}`,
    };
    addTestResults(id, newData).then((res) => {
      if (res.data.success === true) {
        setOpen(false);
        form.resetFields();
        setData([...data, newData]);
        setAppId(appId + 1);
      }
    });
  };
  // Get Patient And Test Results
  useEffect(() => {
    getTestResults(id).then((res) => {
      if (res?.data) {
        if (res.data.results && res.data.results.length > 0) {
          setData(
            res.data.results.map((item) => {
              return {
                id: item.id,
                patiendId: item.PatientId,
                date: item.createdAt,
                result: item.resultFile,
                note: item.note,
              };
            })
          );
        }
      } else {
        setData([]);
      }
    });
    getPatientByID(id).then((res) => {
      if (res.data.success === true) {
        setPatientDetails(res.data.data);
      } else {
        openNotification('Error', 'Could not find patient.');
      }
    });
  }, [id]);
  return (
    <DashboardLayout showSider={true}>
      <div className="App">
        <Title className={styles.title}>Medication</Title>
        <div className={styles.patientInfo}>
          <div className={styles.patientAva}>
            <Space align="center" direction="vertical" wrap size={16}>
              <Avatar shape="square" size={64} icon={<UserOutlined />} />
            </Space>
          </div>
          <div className={styles.patientDetail}>
            <Title level={3}>
              {patientsData.firstName} {patientsData.lastName}
            </Title>
            <Text>DOB: {patientsData.DOB}</Text> <br></br>
            <Text>Gender: {patientsData.gender}</Text> <br></br>
            <Text>Phone: {patientsData.phone}</Text>
          </div>
          <Button type="primary" className={styles.addBtn} primary onClick={() => showDrawer()}>
            <PlusOutlined /> Add Medication
          </Button>
        </div>
      </div>

      {/* Result detail */}
      <div className="appDetail">
        <Table columns={columns} dataSource={data} />
      </div>

      {/* Add result */}
      <div className={styles.addApp}></div>

      {/* Add result */}
      <Drawer
        title="Add new test results"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" onClick={() => form.submit()} type="primary">
              Submit
            </Button>
          </Space>
        }>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Date is required' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Result"
            name="result"
            rules={[{ required: true, message: 'Result is required' }]}>
            <Input placeholder="Basic usage" />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
    </DashboardLayout>
  );
};
export default PatientMedication;
