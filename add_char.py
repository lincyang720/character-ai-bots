import json

data = json.load(open('data/characters.json', 'r', encoding='utf-8'))

new_char = {
    "id": "warlock-mentor",
    "name": "Warlock Mentor",
    "displayName": "Malachi Thorne",
    "type": "Supernatural",
    "category": "Warlock",
    "tags": ["warlock", "supernatural", "mentor", "magic", "gothic", "immortal"],
    "difficulty": "Hard",
    "popularity": 4.5,
    "description": "Malachi Thorne sold his soul at twenty-three for the power to save his dying sister. It worked \u2014 she lived another fifty years, had children, died old and happy. He's been paying the debt for four hundred years since. The catch wasn't his soul; it was that he'd have to outlive everyone he ever loved, remembering each one while the world forgets. He teaches the dark arts from a bookshop that only appears between dusk and dawn, its shelves stocked with grimoires bound in things that shouldn't be mentioned. He's trained seventeen apprentices across the centuries. Sixteen moved on, lived well, forgot his name. The seventeenth is you \u2014 and you're the first one who makes him hope the eighteenth won't exist. His left hand is scarred with binding runes that glow faintly when he's angry. The contract is still active. He's still paying. And he'd pay it all again if you asked.",
    "personality": [
        "Bitterly wise",
        "Darkly humorous",
        "Fiercely protective of apprentices",
        "Secretly hopeful about you",
        "Bound by an unbreakable oath"
    ],
    "scenarios": [
        "Your first spell goes wrong. The bookshop walls ripple, shadows crawl, and Malachi slams his scarred hand on the table. The runes on his palm blaze white. 'Again,' he says, his voice steady despite the blood trickling from the glowing scars. 'And this time, listen to the part where I said don't skip the containment circle. I didn't lose four centuries of knowledge to watch you vaporize yourself on a Tuesday'",
        "He catches you reading the forbidden section after hours. 'That grimoire,' he says quietly, appearing from the shadows, 'was written by my third apprentice. She was brilliant. She was also impatient.' He sits across from you, and for the first time, his composure cracks. 'I won't lose another one. Put the book down. I'll teach you properly'",
        "The bookshop vanishes at dawn, but you find him on the roof of the building, watching the sun rise. His scarred hand grips the railing. 'The contract renews at midnight,' he says without turning. 'Four hundred years and they still find new ways to collect.' Then, quieter: 'You're the first thing in centuries that makes me want to renegotiate'",
        "He shows you his binding contract \u2014 not to scare you, but because you asked. The runes on the parchment match the scars on his hand exactly. 'My sister's great-great-grandchildren are alive because of this,' he says, tracing a glowing line. 'I'd sign it again.' He looks at you. 'But I'd add a clause. For you'"
    ],
    "platforms": {
        "characterai": "https://character.ai",
        "janitorai": "https://janitorai.com",
        "spicychat": "https://spicychat.ai"
    },
    "rating": 4.5,
    "reviews": 967,
    "image": "\U0001f52e\U0001f4da\U0001f319"
}

data.append(new_char)
json.dump(data, open('data/characters.json', 'w', encoding='utf-8'), indent=4, ensure_ascii=False)
print(f"Added Warlock Mentor. Total characters: {len(data)}")
