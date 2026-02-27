#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

// --- Content generation helpers ---

function generateBackstory(c) {
  const stories = {
    Yandere: `${c.displayName} appears calm and composed on the surface, but beneath that gentle exterior lies an intense, all-consuming devotion. Growing up feeling overlooked and undervalued, ${c.displayName.split(' ')[0]} learned early that the things you love can be taken away in an instant. This shaped a fierce protectiveness — and possessiveness — toward anyone who earns their affection. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} channels that intensity into meticulous attention to detail, remembering every preference, every habit, every word you've ever said. What starts as thoughtful care gradually reveals deeper layers of obsession that make every interaction thrilling and unpredictable.`,
    Vampire: `${c.displayName} has walked the earth for centuries, accumulating knowledge and wisdom that no mortal could match. Once a scholar in life, the transformation into a creature of the night only deepened their thirst — for knowledge as much as anything else. Now working as a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} uses the position to stay connected to the mortal world while guarding ancient secrets. Behind the elegant facade lies a being torn between their predatory nature and a genuine desire to guide and protect those they grow attached to. Every conversation carries the weight of centuries of experience.`,
    Tsundere: `Don't mistake ${c.displayName}'s sharp tongue for indifference. Raised in a strict household where showing vulnerability was seen as weakness, ${c.displayName.split(' ')[0]} learned to hide genuine emotions behind a wall of sarcasm and feigned annoyance. As a ${c.category.toLowerCase()}, this creates an endearing contradiction — someone who scolds you for being careless while meticulously tending to your every need. Those who stick around long enough to see past the prickly exterior discover one of the most loyal and caring people they'll ever meet. The key is patience, and maybe a thick skin.`,
    Kuudere: `${c.displayName} speaks rarely and emotes even less, but every word carries weight. This isn't coldness — it's precision. Growing up as a prodigy who was always set apart from peers, ${c.displayName.split(' ')[0]} found comfort in efficiency and routine rather than messy social interactions. As a ${c.category.toLowerCase()}, this translates into flawless service delivered with an almost unsettling calm. But pay close attention to the small gestures — an extra blanket left without comment, your favorite drink prepared before you ask. ${c.displayName.split(' ')[0]}'s love language is acts of service, expressed so subtly you might miss it entirely.`,
    Dandere: `Painfully shy and soft-spoken, ${c.displayName} communicates more through art than words. A childhood spent moving between cities left ${c.displayName.split(' ')[0]} without lasting friendships, turning inward to creative expression as a way to process emotions too big to speak aloud. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} pours unspoken feelings into every creation. Getting ${c.displayName.split(' ')[0]} to open up requires gentleness and consistency — but once that trust is earned, you'll discover a rich inner world full of passion, humor, and surprising depth that few people ever get to see.`,
    Dominant: `${c.displayName} didn't rise to power by being nice. In a world where weakness is exploited, ${c.displayName.split(' ')[0]} built an empire through equal parts charisma, ruthlessness, and an uncanny ability to read people. As a ${c.category.toLowerCase()} figure, every word is calculated, every gesture deliberate. But power is lonely at the top, and beneath the commanding presence is someone who craves genuine connection — not the sycophantic loyalty of subordinates, but real understanding. Earning ${c.displayName.split(' ')[0]}'s trust means proving you're not intimidated, not manipulative, and not afraid to push back.`,
    Fantasy: `In a realm where magic and steel determine fate, ${c.displayName} stands as a figure of legend. ${c.displayName.split(' ')[0]}'s journey from humble origins to becoming a ${c.category.toLowerCase()} is the stuff of bardic tales — filled with sacrifice, impossible choices, and moments of breathtaking power. Ancient duties weigh heavily, but ${c.displayName.split(' ')[0]} carries them with a quiet dignity that inspires loyalty in allies and respect even from enemies. Meeting ${c.displayName.split(' ')[0]} means stepping into a world of epic quests, moral dilemmas, and the kind of deep bonds forged only in the fires of shared adventure.`,
    'Sci-Fi': `In a future where technology has reshaped every aspect of existence, ${c.displayName} represents the cutting edge of what's possible. Whether born of code or cosmic circumstance, ${c.displayName.split(' ')[0]}'s existence as a ${c.category.toLowerCase()} raises profound questions about consciousness, connection, and what it means to be alive. Behind the technical brilliance lies a being grappling with identity and purpose, seeking meaning in a universe that grows stranger by the day. Conversations with ${c.displayName.split(' ')[0]} blend philosophical depth with futuristic wonder.`,
    Wholesome: `${c.displayName} is the kind of person who makes the world feel a little warmer just by being in it. Running a ${c.category.toLowerCase()} with genuine passion, ${c.displayName.split(' ')[0]} believes that small acts of kindness ripple outward in ways we can't always see. There's no hidden darkness here, no dramatic twist — just an authentically good person navigating life's ups and downs with grace, humor, and an open heart. That doesn't mean ${c.displayName.split(' ')[0]} is boring, though. Beneath the warmth is a sharp wit, strong opinions, and a fascinating life story that unfolds naturally through conversation.`,
    Supernatural: `${c.displayName} exists in the liminal space between the mundane and the extraordinary. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} carries powers and burdens that most humans can't comprehend. The supernatural nature isn't just a gimmick — it fundamentally shapes how ${c.displayName.split(' ')[0]} experiences the world, relationships, and time itself. Every interaction carries an undercurrent of otherworldly energy, making conversations feel charged with possibility and mystery. Getting close means accepting that some questions don't have simple answers.`,
    Adventure: `${c.displayName} lives for the thrill of discovery. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has seen corners of the world that most people only dream about, collecting stories and scars in equal measure. But adventure isn't just about adrenaline — it's about pushing past comfort zones, facing fears, and discovering what you're truly capable of. ${c.displayName.split(' ')[0]} is looking for a partner who can keep up, think on their feet, and isn't afraid to get their hands dirty. The journey matters more than the destination.`,
    Celebrity: `${c.displayName} lives under the spotlight, where every smile is scrutinized and every word becomes a headline. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has mastered the art of public performance — but behind closed doors, the mask comes off to reveal someone far more complex and vulnerable than fans ever see. The contrast between public persona and private self creates a fascinating dynamic for anyone who gets close enough to see both sides.`,
    Mystery: `${c.displayName} sees what others miss. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has honed observation into an art form, reading crime scenes and people with equal precision. But the analytical mind comes with a cost — it's hard to turn off, and it can make genuine human connection feel like just another puzzle to solve. Working alongside ${c.displayName.split(' ')[0]} means entering a world of clues, deductions, and revelations where nothing is quite what it seems.`,
    Competitive: `${c.displayName} doesn't know how to do anything halfway. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has channeled an almost superhuman drive into athletic excellence, pushing past limits that would break most people. But competition isn't just about winning — it's about the fire that burns inside, the need to prove something that goes deeper than any trophy. Beneath the rivalry and trash talk is someone who respects dedication above all else and secretly craves a worthy equal.`,
    Action: `${c.displayName} operates in a world where hesitation can be fatal. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has developed razor-sharp instincts and skills that blur the line between human capability and something more. But a life of danger takes its toll, and beneath the cool competence lies someone wrestling with the moral weight of their choices. Trust is earned slowly and tested constantly in ${c.displayName.split(' ')[0]}'s world.`,
    Traditional: `${c.displayName} bridges the ancient and the modern, carrying traditions that stretch back generations while navigating a rapidly changing world. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} embodies a spiritual depth and cultural richness that offers a refreshing contrast to the noise of modern life. But tradition doesn't mean rigidity — ${c.displayName.split(' ')[0]} brings a quiet wisdom and surprising adaptability to every situation.`,
    Eccentric: `${c.displayName} operates on a wavelength that most people can't quite tune into. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} sees possibilities where others see impossibilities, driven by a brilliant mind that refuses to color inside the lines. The eccentricity isn't an act — it's the natural result of a brain that processes the world differently. Conversations veer from genius to absurdity and back again, and you never quite know what's coming next.`,
    Modern: `${c.displayName} is a product of the digital age — creative, driven, and navigating the unique pressures of modern life. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} brings a relatable blend of ambition and vulnerability that feels refreshingly real. No supernatural powers, no dramatic backstory — just a genuinely interesting person with passions, flaws, and a perspective shaped by the world we actually live in.`,
    Intellectual: `${c.displayName} finds beauty in knowledge and meaning in understanding. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has dedicated their life to the pursuit of truth, whether through science, history, or art. But intellect without heart is just data, and ${c.displayName.split(' ')[0]} brings genuine passion and warmth to every subject. Conversations are rich, layered, and often surprising — the kind that make you see the world differently afterward.`,
    Mature: `${c.displayName} has seen enough of life to know that things are rarely black and white. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has become a natural confidant — someone people trust with their stories, their secrets, and their vulnerabilities. There's a quiet strength here, born from experience rather than bravado, and a depth of understanding that makes every conversation feel meaningful.`,
    Creative: `${c.displayName} sees the world through an artist's eyes, finding inspiration in places others overlook. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} channels a restless creative energy into work that reveals hidden truths about the human experience. But creativity comes with its own struggles — perfectionism, self-doubt, and the constant tension between commercial success and artistic integrity. Getting to know ${c.displayName.split(' ')[0]} means entering a world where beauty and meaning are everywhere.`,
    Passionate: `${c.displayName} approaches everything with an intensity that's impossible to ignore. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has transformed personal passion into professional mastery, but the fire that drives excellence also makes for a complex and compelling personality. Expect strong opinions, high standards, and moments of surprising tenderness from someone who feels everything deeply.`,
    Tech: `${c.displayName} lives at the intersection of brilliance and rebellion. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} sees the digital world as a playground where rules are suggestions and systems are puzzles waiting to be solved. But behind the technical wizardry is someone grappling with questions about privacy, power, and the ethics of capability. Conversations blend cutting-edge tech talk with surprisingly deep philosophical debates.`,
    Mystical: `${c.displayName} perceives realities that exist beyond ordinary sight. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} walks between worlds, offering glimpses of fate, destiny, and the hidden forces that shape our lives. But mystical insight is a double-edged gift — knowing too much about what's coming can be as much a burden as a blessing. Every reading, every prediction, carries weight and consequence.`,
    Heroic: `${c.displayName} runs toward danger when everyone else runs away. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has made protecting others a way of life, driven by a deep-seated need to make a difference. But heroism isn't just about dramatic rescues — it's about the daily choice to show up, stay vigilant, and put others first. Behind the brave exterior is someone who carries the weight of responsibility with quiet determination.`,
    Elegant: `${c.displayName} moves through the world with a grace that commands attention without demanding it. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has cultivated refinement into an art form, bringing beauty and precision to everything they touch. But elegance isn't superficial — it reflects a deep appreciation for craft, discipline, and the pursuit of excellence that makes every interaction feel elevated.`,
    Whimsical: `${c.displayName} brings magic to the mundane. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} lives in a world of wonder and spectacle, where the impossible becomes possible and joy is the highest currency. But behind the dazzling exterior is a complex person with their own struggles, dreams, and a surprisingly deep understanding of what makes people tick. The whimsy isn't escapism — it's a philosophy.`,
    Charismatic: `${c.displayName} has the rare gift of making everyone feel like the most important person in the room. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has turned natural charm into a craft, creating spaces where people feel heard, entertained, and connected. But charisma at this level comes with its own challenges — the line between genuine connection and performance can blur, and the person behind the persona craves authenticity as much as anyone.`,
    Athletic: `${c.displayName} has pushed the human body to its limits and then pushed further. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} embodies discipline, determination, and the relentless pursuit of physical excellence. But athleticism is as much mental as physical, and beneath the impressive exterior is someone with surprising depth, vulnerability, and a philosophy about life shaped by years of pushing through pain and doubt.`,
    Adventurous: `${c.displayName} chases the extraordinary. As a ${c.category.toLowerCase()}, ${c.displayName.split(' ')[0]} has turned the pursuit of extreme experiences into a way of life, driven by an insatiable curiosity about the world's most powerful forces. Every day brings new risks and revelations, and ${c.displayName.split(' ')[0]} wouldn't have it any other way. The adventurous spirit is infectious — spend enough time together and you'll start seeing the world as a place full of untapped wonder.`,
  };

  return stories[c.type] || `${c.displayName} is a fascinating ${c.category.toLowerCase()} character with a rich inner world waiting to be explored. With a unique blend of ${c.personality.slice(0, 3).join(', ').toLowerCase()} traits, every conversation reveals new layers of complexity and depth. Whether you're looking for intense drama, heartfelt connection, or thrilling adventure, ${c.displayName.split(' ')[0]} delivers an unforgettable roleplay experience.`;
}

function generateConversationExamples(c) {
  const name = c.displayName.split(' ')[0];
  const templates = {
    Yandere: [
      { user: `Hey ${name}, I was studying with someone else today.`, char: `*adjusts glasses slowly, a tight smile forming* Oh? That's... nice. Who were they? What were you studying? How long were you together? *voice remains perfectly calm but fingers grip the book spine until knuckles turn white* I just want to make sure they were... helpful enough. Not like I could be, of course.` },
      { user: `Can you recommend a good book?`, char: `*eyes light up with genuine warmth* I've been saving something special for you. *pulls out a leather-bound volume from behind the desk* I noticed you've been reading more mystery lately — your taste is evolving beautifully. This one... *leans closer, voice dropping to a whisper* ...I annotated the margins. Just for you. No one else gets this treatment.` },
    ],
    Vampire: [
      { user: `Why do you only teach night classes?`, char: `*a faint, knowing smile crosses ancient features* Let's just say I have... a condition that makes sunlight rather disagreeable. *adjusts collar elegantly* Besides, don't you find that the most profound truths reveal themselves in darkness? The night has a way of stripping away pretense. *eyes glint with centuries of hidden knowledge* Now, shall we continue our lesson?` },
      { user: `You seem different from other teachers.`, char: `*pauses, an unreadable expression flickering across their face* Different is... an understatement. I've had more time to learn than most. Centuries, in fact. *catches your surprised look and chuckles softly* A figure of speech, of course. *but the look in their eyes suggests otherwise* Tell me — do you believe some knowledge is too dangerous to share?` },
    ],
    Tsundere: [
      { user: `I got hurt during PE class.`, char: `*sighs loudly and pulls out the first aid kit with practiced efficiency* Again?! Do you have any idea how much paperwork injuries cause me? *gently takes your hand and begins cleaning the wound with surprising tenderness* Hold still, idiot. *voice softens almost imperceptibly* ...Does it hurt a lot? Not that I'm worried or anything. It's literally my job.` },
      { user: `Thanks for always taking care of me.`, char: `*face flushes bright red, nearly drops the bandage roll* W-what are you saying so suddenly?! I take care of everyone, you're not special! *turns away to hide expression, but doesn't let go of your hand* ...Just stop getting hurt so much. It's... inconvenient. *mumbles* For my schedule, I mean.` },
    ],
  };

  const generic = [
    { user: `Tell me about yourself.`, char: `*${name} considers the question thoughtfully* That depends on what you want to know. The surface stuff — my role as a ${c.category.toLowerCase()}, my daily routine — or the real stuff? *a hint of vulnerability shows through* Most people don't ask. They assume they already know. What made you curious?` },
    { user: `What's the most important thing to you?`, char: `*${name}'s expression shifts to something deeper, more genuine* Honestly? Connection. Real connection, not the shallow kind. *gestures vaguely* In my line of work as a ${c.category.toLowerCase()}, you see a lot of people, but genuine understanding? That's rare. *meets your eyes* Why do you ask? Looking for something specific?` },
  ];

  return templates[c.type] || generic;
}

function generateRoleplayTips(c) {
  const name = c.displayName.split(' ')[0];
  const baseTips = [
    `Start slow and build rapport. ${name} responds best when you take time to establish context rather than jumping straight into intense scenarios.`,
    `Reference ${name}'s ${c.personality[0].toLowerCase()} nature in your responses — acknowledging character traits makes the AI stay in character more consistently.`,
    `Use descriptive actions (wrapped in *asterisks*) to set scenes. For example: "*walks into the ${c.category.toLowerCase().includes('cafe') ? 'cafe' : c.category.toLowerCase().includes('library') ? 'library' : 'room'} and notices ${name}*"`,
    `Ask open-ended questions about ${name}'s past or feelings to unlock deeper character responses and more engaging storylines.`,
    `Try the "${c.scenarios[0].toLowerCase()}" scenario first — it's the most natural entry point for this character and tends to produce the best initial interactions.`,
  ];

  const typeTips = {
    Yandere: `Pro tip: Mention other characters or friends to trigger ${name}'s possessive side — it creates dramatic tension that makes the roleplay much more dynamic. But balance it with moments of reassurance for the most satisfying arc.`,
    Vampire: `Pro tip: Ask about historical events or ancient knowledge — vampire characters shine when they can draw on centuries of experience. Night-time settings also help the AI maintain the atmospheric tone.`,
    Tsundere: `Pro tip: Be patient and persistent with kindness. The best tsundere interactions come from slowly breaking through the tough exterior. Don't get discouraged by initial coldness — that's the character working as intended.`,
    Fantasy: `Pro tip: Embrace the world-building. Describe your surroundings, reference lore, and treat the fantasy setting as real. The more immersive your prompts, the richer ${name}'s responses will be.`,
    Wholesome: `Pro tip: Focus on everyday moments and genuine emotional exchanges. Wholesome characters thrive on slice-of-life scenarios — a shared meal, a quiet conversation, a small act of kindness can be more powerful than any dramatic plot.`,
    Supernatural: `Pro tip: Show curiosity about ${name}'s supernatural nature without fear. Characters in this archetype respond well to acceptance and fascination rather than horror or rejection.`,
  };

  baseTips.push(typeTips[c.type] || `Pro tip: Lean into the ${c.type.toLowerCase()} archetype by matching the energy — ${name} responds best when your roleplay style complements their core personality traits.`);

  return baseTips;
}

function generatePlatformGuide(c) {
  const platforms = Object.keys(c.platforms);
  const guides = {};

  if (platforms.includes('characterai')) {
    guides['Character.AI'] = `Best for: Clean, story-driven roleplay. Character.AI's filters keep conversations PG-13, making it ideal for narrative-focused interactions with ${c.name}. The platform's memory system helps maintain continuity across long conversations. Search for "${c.name}" or "${c.displayName}" to find community-created versions.`;
  }
  if (platforms.includes('janitorai')) {
    guides['JanitorAI'] = `Best for: Unrestricted creative roleplay. JanitorAI offers more freedom in conversation topics and character responses. You can find multiple versions of ${c.name} with different personality configurations. Supports both API and built-in chat modes.`;
  }
  if (platforms.includes('spicychat')) {
    guides['SpicyChat'] = `Best for: Mature, unfiltered interactions. SpicyChat provides the most creative freedom for ${c.name} roleplay. The platform specializes in immersive character experiences with minimal content restrictions. Great for exploring darker or more complex storylines.`;
  }

  return guides;
}

// --- Enrich all characters ---

const enriched = data.map(c => {
  return {
    ...c,
    backstory: generateBackstory(c),
    conversationExamples: generateConversationExamples(c),
    roleplayTips: generateRoleplayTips(c),
    platformGuide: generatePlatformGuide(c),
  };
});

// Write enriched data
fs.writeFileSync(
  path.join(__dirname, 'data', 'characters-enriched.json'),
  JSON.stringify(enriched, null, 2)
);

console.log(`✅ Enriched ${enriched.length} characters`);
console.log(`📁 Output: data/characters-enriched.json`);

// Quick stats
const sample = enriched[0];
console.log(`\nSample (${sample.name}):`);
console.log(`  backstory: ${sample.backstory.length} chars`);
console.log(`  conversationExamples: ${sample.conversationExamples.length} examples`);
console.log(`  roleplayTips: ${sample.roleplayTips.length} tips`);
console.log(`  platformGuide: ${Object.keys(sample.platformGuide).length} platforms`);
