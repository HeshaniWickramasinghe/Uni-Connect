const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testApi() {
    try {
        // Create dummy files
        fs.writeFileSync('dummy.jpg', 'fake jpg content');
        fs.writeFileSync('dummy.pdf', 'fake pdf content');

        const form = new FormData();
        form.append('name', 'John Doe');
        form.append('email', 'john@example.com');
        form.append('faculty', 'Computing');
        form.append('skills', JSON.stringify(['React']));
        form.append('moduleName', 'Web Dev');
        form.append('moduleCode', 'IT3020');
        form.append('date', '2026-05-12');
        form.append('time', '12:00');
        form.append('duration', 60);
        form.append('price', 50);
        form.append('meetingLink', 'https://zoom.us');
        
        form.append('qualificationFile', fs.createReadStream('dummy.jpg'), {
            filename: 'dummy.jpg',
            contentType: 'image/jpeg'
        });
        
        form.append('shortNoteFile', fs.createReadStream('dummy.pdf'), {
            filename: 'dummy.pdf',
            contentType: 'application/pdf'
        });

        console.log("Sending request...");
        const response = await axios.post('http://localhost:5000/api/kuppi-sessions', form, {
            headers: form.getHeaders()
        });
        
        console.log("SUCCESS:", response.data);
    } catch (err) {
        if (err.response) {
            console.error("SERVER ERROR RESPONDED:", err.response.data);
        } else {
            console.error("NETWORK ERROR:", err.message);
        }
    } finally {
        if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
        if (fs.existsSync('dummy.pdf')) fs.unlinkSync('dummy.pdf');
    }
}

testApi();
