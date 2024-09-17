const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./queries'); 

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json({
            users: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            error: 'An error occurred while fetching users'
        });
    }
});

app.post('/post', async (req, res) => {
    const { name, email } = req.body; 

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.json({
            message: `User ${result.rows[0].name} with email ${result.rows[0].email} created successfully!`
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({
            error: 'An error occurred while creating the user'
        });
    }
});


app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        if (result.rows.length > 0) {
            res.json({
                message: `User with ID ${id} updated successfully`,
                user: result.rows[0],
            });
        } else {
            res.status(404).json({
                error: `User with ID ${id} not found`
            });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            error: 'An error occurred while updating the user'
        });
    }
});


app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
       
        const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (userCheck.rows.length > 0) {
            const deleteResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
            res.json({
                message: `User with ID ${deleteResult.rows[0].id} deleted successfully!`,
            });
        } else {
            res.status(404).json({
                error: `User with ID ${id} not found`
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            error: 'An error occurred while deleting the user'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
