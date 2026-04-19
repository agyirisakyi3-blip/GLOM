const fs = require('fs');
const path = require('path');

class FeatureUpdater {
    constructor() {
        this.rootDir = __dirname;
    }

    addEvent(event) {
        const indexPath = path.join(this.rootDir, 'index.html');
        let content = fs.readFileSync(indexPath, 'utf8');

        const eventHTML = `
                <div class="event-card">
                    <div class="event-date">
                        <span class="date-day">${event.day}</span>
                        <span class="date-month">${event.month}</span>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>`;

        const insertPoint = '<a href="#contact" class="btn btn-outline">View All Events</a>';
        content = content.replace(insertPoint, eventHTML + '\n' + insertPoint);

        fs.writeFileSync(indexPath, content);
        console.log(`✓ Event added: ${event.title}`);
    }

    addSermon(sermon) {
        const indexPath = path.join(this.rootDir, 'index.html');
        let content = fs.readFileSync(indexPath, 'utf8');

        const sermonHTML = `
                <div class="media-card">
                    <div class="media-thumbnail">
                        <span>▶</span>
                    </div>
                    <h3>${sermon.title}</h3>
                    <p>${sermon.preacher}</p>
                </div>`;

        const insertPoint = '<a href="#" class="link-arrow">View All Sermons →</a>';
        content = content.replace(insertPoint, sermonHTML + '\n' + insertPoint);

        fs.writeFileSync(indexPath, content);
        console.log(`✓ Sermon added: ${sermon.title}`);
    }

    updateChurchInfo(info) {
        const files = ['index.html', 'about.html', 'contact.html', 'giving.html'];
        
        files.forEach(file => {
            const filePath = path.join(this.rootDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            if (info.address) {
                content = content.replace(/📍 \[.*?\]/g, `📍 ${info.address}`);
            }
            if (info.phone) {
                content = content.replace(/📞 \[.*?\]/g, `📞 ${info.phone}`);
            }
            if (info.email) {
                content = content.replace(/✉️ \[.*?\]/g, `✉️ ${info.email}`);
            }

            fs.writeFileSync(filePath, content);
        });

        console.log('✓ Church info updated');
    }

    updateBankDetails(details) {
        const givingPath = path.join(this.rootDir, 'giving.html');
        let content = fs.readFileSync(givingPath, 'utf8');

        content = content.replace(/<strong>Bank Name:<\/strong> \[.*?\]/, `<strong>Bank Name:</strong> ${details.bankName}`);
        content = content.replace(/<strong>Account Number:<\/strong> \[.*?\]/, `<strong>Account Number:</strong> ${details.accountNumber}`);
        content = content.replace(/<strong>Mobile Money:<\/strong> \[.*?\]/, `<strong>Mobile Money:</strong> ${details.mobileMoney}`);

        fs.writeFileSync(givingPath, content);
        console.log('✓ Bank details updated');
    }

    addTeamMember(member) {
        const aboutPath = path.join(this.rootDir, 'about.html');
        let content = fs.readFileSync(aboutPath, 'utf8');

        const memberHTML = `
                    <div class="team-card">
                        <div class="team-image">
                            <img src="${member.image}" alt="${member.name}">
                        </div>
                        <h3>${member.name}</h3>
                        <p class="team-role">${member.role}</p>
                        <p>${member.bio}</p>
                    </div>`;

        const insertPoint = '</div>\n            </div>\n\n            <div class="content-block">';
        content = content.replace(insertPoint, memberHTML + '\n' + insertPoint);

        fs.writeFileSync(aboutPath, content);
        console.log(`✓ Team member added: ${member.name}`);
    }
}

const updater = new FeatureUpdater();

const args = process.argv.slice(2);
const command = args[0];

if (command === 'event') {
    updater.addEvent({
        day: args[1] || '01',
        month: args[2] || 'JAN',
        title: args[3] || 'New Event',
        description: args[4] || 'Event description',
        time: args[5] || '6:00 PM'
    });
} 
else if (command === 'sermon') {
    updater.addSermon({
        title: args[1] || 'New Sermon',
        preacher: args[2] || 'Snr Pastor'
    });
}
else if (command === 'info') {
    updater.updateChurchInfo({
        address: args[1],
        phone: args[2],
        email: args[3]
    });
}
else if (command === 'bank') {
    updater.updateBankDetails({
        bankName: args[1],
        accountNumber: args[2],
        mobileMoney: args[3]
    });
}
else if (command === 'team') {
    updater.addTeamMember({
        name: args[1] || 'New Member',
        role: args[2] || 'Role',
        image: args[3] || 'image.jpg',
        bio: args[4] || 'Bio description'
    });
}
else {
    console.log(`
GLOBAL LIFE OUTREACH MINISTRIES - Feature Update Script

Usage:
  node update.js event <day> <month> <title> <description> <time>
  node update.js sermon <title> <preacher>
  node update.js info <address> <phone> <email>
  node update.js bank <bankName> <accountNumber> <mobileMoney>
  node update.js team <name> <role> <image> <bio>

Examples:
  node update.js event 15 MAY "Youth Night" "Youth fellowship" "6:00 PM"
  node update.js sermon "Walking in Faith" "Snr Pastor"
  node update.js info "123 Church St" "(555) 123-4567" "email@church.org"
  node update.js bank "Ghana Commercial Bank" "123456789" "0555555555"
  node update.js team "John Doe" "Youth Pastor" "john.jpg" "Youth leader"
`);
}
