// Yandere Librarian Bot - Interactive Chat Demo

// Pre-defined responses for demo
const yandereLibrarian = {
    responses: {
        "I need help finding a book": [
            "*eyes light up* Oh, you need my help? How wonderful! *walks closer* Tell me, what kind of book are you looking for? I know every single book in this library... and I've been keeping track of what you like to read. *smiles sweetly* Isn't that helpful?",
            "*adjusts glasses* You know, I've already prepared a reading list just for you. I noticed you prefer mysteries with dark themes... *voice drops* How fitting."
        ],
        "Just browsing around": [
            "*expression darkens slightly* Browsing? *forces a smile* I see... You're not here to see me specifically then? *laughs nervously* That's fine, that's fine... But you will stay for a while, won't you? The library can be... unsafe after hours. You need me to protect you.",
            "*follows closely* Let me accompany you while you browse. After all, I know exactly where everything is. *whispers* And I want to know what catches your interest..."
        ],
        "I came to see you": [
            "*blushes deeply, hands trembling* You... you came to see me? *eyes widen* Oh, oh this is... *clutches book to chest* I knew it! I knew you felt the same way! *grabs your hand* Come with me to the restricted section. No one else is allowed there... but you're special. Only you.",
            "*tears of joy* Finally! Do you know how long I've waited to hear those words? *voice becomes intense* You won't leave me, right? Promise me. Promise you'll never talk to anyone else the way you talk to me!"
        ]
    },

    getResponse: function(input) {
        const lowerInput = input.toLowerCase();

        // Check for exact matches first
        for (const [key, responses] of Object.entries(this.responses)) {
            if (lowerInput.includes(key.toLowerCase())) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }

        // Contextual responses
        if (lowerInput.includes('leave') || lowerInput.includes('go') || lowerInput.includes('bye')) {
            return "*blocks the door* Leave? You can't leave yet! We were just starting to have fun... *eyes narrow* Besides, it's late. What if something happens to you out there? Stay with me. Just a little longer...";
        }

        if (lowerInput.includes('other') || lowerInput.includes('friend') || lowerInput.includes('someone')) {
            return "*voice turns cold* Who? Who are you talking about? *steps closer* You don't need anyone else. I can be everything you need. Your friend, your companion... *whispers intensely* your only one.";
        }

        if (lowerInput.includes('study') || lowerInput.includes('work')) {
            return "*brightens up* Oh! You need a quiet place to study? I have the perfect spot! *takes your hand* It's in the back corner, where no one ever goes. I'll make sure nobody disturbs you... *smiles* I'll sit nearby and watch... I mean, guard you!";
        }

        if (lowerInput.includes('help') || lowerInput.includes('need')) {
            return "*touches your arm gently* You need help? I'm so happy you came to me! *adjusts glasses* Whatever you need, I'll provide it. Books, information, companionship... *voice drops* protection from people who don't deserve your attention.";
        }

        if (lowerInput.includes('thanks') || lowerInput.includes('thank')) {
            return "*blushes* You're thanking me? *fidgets with book* You're so kind... That's why I... *catches herself* I mean, it's my job to help you. But I'd do it anyway. I'd do anything for you.";
        }

        // Default responses
        const defaultResponses = [
            "*tilts head* That's interesting... *writes something in a notebook* I'll remember you said that. I remember everything about you, actually. *smiles* Every word, every expression... Don't you think that's romantic?",
            "*adjusts glasses while maintaining eye contact* You know, we're alone in this section right now. The security cameras don't work here. *smiles innocently* Just an observation. Tell me more about yourself.",
            "*steps closer* I've been studying you... I mean, I've noticed you around. *nervously laughs* You're different from the others. Special. And special things should be... protected. Kept safe. *whispers* Kept close."
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
};

// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Quick reply buttons
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const reply = this.getAttribute('data-reply');
            sendMessage(reply);
            this.style.opacity = '0.5';
            this.disabled = true;
        });
    });

    // Send button
    sendButton.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
            chatInput.value = '';
        }
    });

    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        }
    });

    function sendMessage(message) {
        // Add user message
        addMessage(message, 'user');

        // Simulate typing delay
        setTimeout(() => {
            const response = yandereLibrarian.getResponse(message);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        if (type === 'bot') {
            messageDiv.innerHTML = `
                <div class="avatar">📚</div>
                <div class="message-content">
                    <p class="character-name">Ayumi</p>
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p class="character-name">You</p>
                    <p>${text}</p>
                </div>
                <div class="avatar">👤</div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add fade-in animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll reveal animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});