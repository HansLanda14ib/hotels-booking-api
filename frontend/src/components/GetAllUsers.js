import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
const AllUsers = () => {
    const [users, setUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const usersCollection = firebase.firestore().collection('users');
            const querySnapshot = await usersCollection.get();

            const userList = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                userList.push(userData);
            });

            console.log('Retrieved users:', userList); // Log the retrieved user data
            setUsers(userList);
        } catch (error) {
            console.error('Error getting users:', error.message);
        }
    };


    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <h1>All Users</h1>
            <div>
                {users.map((user, index) => (
                    <div key={index}>
                        <p>firstName: {user.firstName}</p>
                        <p>lastname: {user.lastName}</p>
                        <p>email: {user.email}</p>
                        <p>phoneNumber: {user.phoneNumber}</p>
                        <p>user ID: {user._id}</p>
                        {/* Add other user information to display */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUsers;
