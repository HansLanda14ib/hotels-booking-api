import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Hotels = () => {
    const [hotelData, setHotelData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/v1/hotels')
            .then(response => {
                setHotelData(response.data.hotels);
            })
            .catch(error => {
                console.error('Error fetching hotels:', error);
            });
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'Address',
            render: (record) => (
                <span>
          {record.location.addressLineOne}, {record.location.city}, {record.location.state}, {record.location.country}
        </span>
            ),
        },
        {
            title: 'Photos',
            dataIndex: 'photos',
            key: 'photos',
            render: (photos) => (
                <span>
          {photos.map(photo => (
              <img src={photo} alt="Hotel" key={photo} style={{ width: '200px', height:'200px', marginRight: '2px' }} />
          ))}
        </span>
            ),
        },
        // You can add more columns as needed based on your data structure
    ];
    return (
        <Table
            dataSource={hotelData}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            summary={() => (
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={3} index={0}>{hotelData.length}</Table.Summary.Cell>
                </Table.Summary.Row>
            )}
        />
    );
};

export default Hotels;
