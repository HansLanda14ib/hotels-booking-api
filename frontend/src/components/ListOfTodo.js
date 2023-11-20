import React, {useEffect} from 'react';
import axios from 'axios';

export default function ListOfTodo({token}) {
    const [todos, setTodos] = React.useState([]);
    useEffect(() => {
        if (token) {
            //console.log(token)
            fetchData(token);
        }
    }, [token]);

    const fetchData = async (token) => {
        const res = await axios.get('http://localhost:5001/api/v1/hotels', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        setTodos(res.data.todos);
        console.log(res.data);
    };

    return (
        <div>
            <h1>List of todo</h1>
            {todos?.map((todo) => (
                <div key={todo.title}>
                    <h1>{todo.title}</h1>
                </div>
            ))}
        </div>
    );
}
