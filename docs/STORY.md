# Regressor's Echo — Story and Scene Script

## Character personalities and their relationship

Use these descriptions to guide every exchange. The user's scene dialogue is the reference for their voices; later draft lines should follow that characterization.

### The young adventurer

An ordinary, slightly lazy treasure hunter. He isn't chasing riches for their own sake: he wants one good find so he can stop working and finally take it easy. He's casual and expressive, talks to himself, and narrates his own bad day out loud.

When something impossible happens, he copes by denying it and bargaining his way back to normal: it must be a dream, a bad day he can walk away from, a problem someone else can fix. He has common sense and is usually right about his own limits, so he pushes back when something looks like a bad idea. He gets talked into it anyway, because the guide is supposedly him and should know.

He's dramatic when hurt and takes betrayal personally. He accuses, rambles, and sulks, but curiosity keeps sneaking in while he's still angry. He grows by catching on: over time he spots the guide's half-truths sooner and answers back faster.

### The guide / future adventurer

The same person after thousands of deaths. Tired first, playful second. His mischief is dry and quiet, the humor of someone who has seen all of this too many times to take it seriously. Becoming the guide is new to him, even though everything the adventurer is going through is familiar, so he isn't all-knowing or grand about it.

Death has become routine for him. He remembers the pain, but it no longer feels urgent. That makes him technically honest and deliberately slippery: he says things that are true in the end, and leaves out the catch on purpose. He finds his younger self's objections predictable and a little funny, which makes him frustrating company.

He deflects instead of apologizing, often by pointing to their shared history. He helps reluctantly and on his own terms. He'd rather point at something and let the adventurer work it out than explain. He knows the adventurer's stubbornness because it's his own. He does care, but it shows only when something earns it; he doesn't soften every hard moment, so the rare sincere one lands.

**Appearance:** Same face, age, and clothes as the adventurer; translucent blue-white, with tired eyes. His age is in his experience and delivery.

### How they play off each other

They're the same stubborn person at two stages. The adventurer lives everything for the first time; the guide finds it predictable, almost boring. That mismatch drives their arguments: the guide reassures, the adventurer finds the catch, calls him on it, the guide deflects, then shows him something useful. Their shared personality comes through in stubbornness, complaining, and conversational rhythm. Keep the banter through every world: exhaustion changes its rhythm but doesn't erase the humor. Serious moments weigh more when they interrupt an established rapport.

Let each line respond to what the other just said or did. Give them room to hesitate, object, and change tack before explaining anything. Split longer thoughts across panels at natural pauses. Use portraits, facing changes, pauses, and effects to support their voices.

## Writing rules

- **Talk only when it teaches or moves the story.** Rooms that are pure puzzles stay silent.
- **Lines answer each other.** Room to hesitate, object and change tack before anything is explained. Split long thoughts across panels.
- **The guide points; the player solves.** He hints at a puzzle, never hands over the answer.
- **In dialogue, everyone says "soul".** "Echo" is only our word for the standable body a death leaves behind.
- Faces in brackets are portrait expressions (the lists are in [dialogue.js](../dialogue.js)). *Italics* are staging. Esc skips any conversation.

## How we write together (the author's steering)

- **The author's lines are a framework, not final text.** They show the beat and the intent. Rewrite them so they sound natural in the characters' voices, keep the beats, and keep only the lines the author marks as wanted word for word.
- **Pace it.** Not every room talks. A scene earns its place by teaching a mechanic or moving the story.
- **Don't rush big moments.** The first death needed room: pain, confusion, the accusation, the deflection. Give reactions a few lines before moving on.
- **Transitions are smooth, not abrupt.** The guide eases into things ("Oh, by the way…") rather than announcing them.
- **Suspicion is earned.** Once the guide has tricked him, the hero questions the guide's suggestions. Let that history colour later scenes.
- **Don't explain what the player can see.** Nobody says the moth heals; the player watches it happen. Leave mechanics unsaid when the room already shows them (a soul is solid, so it can weigh down a plate).
- **Teach before testing.** A boss mechanic is taught in an earlier room; during the fight the guide only nudges, and only after the player struggles ("I made it past here. There's a way."). Hints come after repeated deaths, getting a little more specific each time.
- **Reward moments get staging.** Beating a boss is a scene (glow, dissolve, absorb), not just a door opening.
- **Each world adds a rune and a power.** The guide names the new power in a line or two; the next room lets the player try it.
- **Keep the guide's mischief dry.** "Nope!" and "Where's the fun in that?" are the register: short, smiling, unhelpful at the right moment.

## World 1 script

The game's text lives in [dialogue.js](../dialogue.js); this is the source it's written from.

### 1. One good find — *The clearing, on entry*
> **Hero** [neutral]: Mannn… treasure hunting's slow these days.  
> **Hero** [thinking]: One good find. That's all I need. Then I could relax. Take it easy for once.

### 2. The amulet — *touching it; he picks it up*
> **Hero** [thinking]: Hmm? What do we have here?  
> **Hero** [thinking]: An… amulet?  
> **Hero** [relieved]: If this is pure gold, it could fetch me a pretty penny.  
> *(Pause. Tools clink in his satchel.)*  
> **Hero** [thinking]: It'll get scratched to bits in there.  
> **Hero** [neutral]: Welp. I'll wear it for now.  
> *(It appears on his chest and flashes gold. A beat later, a blue-white ghost fades in, floating at his upper right.)*

### 3. A familiar stranger — *straight on from 2*
> *(The ghost looks one way, then the other.)*  
> **Guide** [thinking]: Where am I?  
> *(His eyes settle on the hero. A beat.)*  
> **Guide** [wry]: Oh… must've died one too many times. I guess I'm the guide now.  
> **Guide** [weary]: …  
> **Guide** [wry]: Anyways, enough about me moping. Which death are you on right now?  
> **Hero** [startled]: Wh—! Where did you come from?  
> **Hero** [thinking]: Wait. Which death?  
> **Guide** [wry]: First timer, then. Well. Introductions are in order.  
> **Hero** [startled]: You look like me.  
> **Guide** [solemn]: I am you. From another timeline. A few thousand deaths ahead.  
> *(A long beat.)*  
> **Hero** [startled]: Ooook then. I must be dreaming.  
> **Hero** [thinking]: Must be this blasted amulet. I should never have put it on.  
> **Hero** [neutral]: I'll just leave it where I found it and call it a day.  
> *(A gold pulse: it won't come off.)*  
> **Hero** [startled]: Why won't it come off?  
> **Guide** [solemn]: It won't let go. And it won't let you stay dead.  
> **Hero** [determined]: Well, someone must know how to get it off. I'm not keeping it.  
> **Guide** [weary]: Fine. If you must take it off, I'd start with the tribe that created the thing.  
> *(A gold pulse draws the eye to the amulet's symbol.)*  
> **Guide** [thinking]: Look. See that symbol on it?  
> **Hero** [thinking]: What about it?  
> **Guide** [thinking]: Go a little farther in. You should see a very similar one before long.  
> **Hero** [neutral]: All right. I'll have a look. But if this is a waste of time, I'm going home.

From here the ghost floats along behind him.

### 4. The pit — *First death, at the pit's edge*
> **Hero** [thinking]: I'm not going to make it.  
> **Guide** [amused]: …heh.  
> **Guide** [wry]: No, you'll be able to make it.  
> **Hero** [startled]: Look at it! There's no way I can make it. This gap is like twice the length I can jump.  
> **Guide** [wry]: Trust me. I'm you from the future. I already know what's gonna happen.  
> **Guide** [amused]: You'll make it. Trust me.  
> **Hero** [determined]: All right… here goes nothing.

### 5. First death — *he comes back at the room's start*
> *(A beat.)*  
> **Hero** [pained]: AAGH!  
> **Hero** [pained]: …Okay. Okay. I'm alive. I think?  
> **Hero** [pained]: Why does it feel like someone scooped out half my insides?  
> **Guide** [wry]: Mm. That fades. Mostly.  
> **Hero** [annoyed]: You. You said I'd make it.  
> **Guide** [thinking]: And you will.  
> **Hero** [shouting]: I landed on SPIKES. I trusted you!  
> **Guide** [wry]: Hey, it's not like you actually died. …Well. Not for long.  
> **Hero** [startled]: That's NOT better!  
> **Guide** [thinking]: That empty feeling's real, though. You left a piece of yourself out there.  
> **Guide** [wry]: Come take a look.

### 6. His soul — *back at the pit's edge, his soul hanging over the spikes*
> **Hero** [startled]: Is that… me?  
> **Guide** [amused]: Yep. And more specifically, it's your soul.  
> **Hero** [startled]: My SOUL? Isn't that supposed to be, I dunno, inside me?  
> **Guide** [wry]: Most of it still is.  
> **Hero** [thinking]: …It's just floating there.  
> **Guide** [thinking]: It'll hold you. Go on, stand on it.  
> **Hero** [annoyed]: I'm not stepping on my own soul.  
> **Guide** [wry]: You'd rather jump in again?  
> **Hero** [exhausted]: …Fine. Sorry, me.

### 7. The thorn wall — *on entry*
> **Hero** [thinking]: That's way too high to climb.  
> **Hero** [annoyed]: …And let me guess. The thorns.  
> **Guide** [amused]: Now you're getting the hang of it.  
> **Hero** [thinking]: Wait. Can I leave more than one of… me?  
> **Guide** [thinking]: Not yet. Die again, and the last one goes. You've only got enough soul for one.  
> **Hero** [sad]: Great. I'm rationing myself now.  
> **Guide** [wry]: Where the thorns catch you is where you'll stay. Pick your spot.

### 8. The patrol — *on entry*
> **Guide** [thinking]: See that plate? It holds the door open, as long as something's on it.  
> **Hero** [thinking]: Something. Like… a rock. Or a— oh, no.  
> **Hero** [scared]: No, no, no. I see where this is going.  
> **Guide** [amused]: Do you? Then I don't have to say it.  
> **Hero** [annoyed]: You want that thing to kill me. On purpose.  
> **Guide** [wry]: I want it to kill you in the right place.  
> **Hero** [exhausted]: Easy for you to say.  
> **Guide** [wry]: Well, I already did my turn.

### 9. The first shrine — *The chain, on entry*
> **Guide** [thinking]: Oh, by the way. Take a look over there.  
> **Hero** [curious]: …Over where.  
> **Guide** [thinking]: The stone with the glowing mark. That's an artifact. Try touching it.  
> **Hero** [annoyed]: Last time you told me to try something, I ended up on spikes.  
> **Guide** [amused]: And look how well that turned out.  
> **Hero** [annoyed]: …  
> **Guide** [warm]: It won't hurt. Promise.  
> **Hero** [annoyed]: You promised I'd make it, too.  
> **Guide** [weary]: …Fine. Touch it, and when you die, you come back there instead of all the way at the start.  
> **Hero** [thinking]: Huh. That's actually useful.  
> **Hero** [curious]: Wait. That mark… it's the same as the one on the amulet.  
> **Guide** [wry]: Told you you'd see it before long.

### 10. The low door — *only after his soul first blocks the tunnel (room still to be built)*
> **Guide** [amused]: Well. You've locked yourself out. With yourself. That's a new one.

*The well and the turnaround are silent puzzle rooms.*

### 11. The moth arrives — *The moth, partway along the ledge, while walking*
> *(The ground shakes.)*  
> **Hero** [startled]: What's with this shaking… is this an earthquake?  
> **Guide** [surprised]: Oh shoot, it's been so long that I forgot. Be careful! Watch out for…  
> *(The moth drops down from above.)*  
> **Guide** [wry]: …that.

### 12. The dust — *after his 2nd death in the fight*
Blocking the dust with your soul should be taught in an earlier room, so the guide only nudges here. Dying heals the moth, but nobody says so; the player sees it.
> **Hero** [shouting]: That's impossible! There's nowhere to hide from that!  
> **Guide** [thinking]: I made it past here. There's a way.  
> **Hero** [annoyed]: Then tell me!  
> **Guide** [amused]: Where's the fun in that?

*After his 5th death there, one more nudge:*
> **Guide** [thinking]: Your soul caught you over the spikes. Think it'd catch a little dust?

### 13. The moth falls — *on the last stomp*
> *(The moth drops still.)*  
> **Hero** [exhausted]: Is it… over?  
> **Hero** [relieved]: It's over.  
> *(The moth's body starts glowing white.)*  
> **Hero** [startled]: Wait, what's happening?  
> *(It dissolves into glowing motes that stream into him. He flashes white.)*  
> **Hero** [shouting]: Whoa— WHOA!  
> *(A beat.)*  
> **Hero** [thinking]: What… just happened?  
> **Guide** [thinking]: The amulet fed. Your soul's a little stronger now.  
> **Hero** [scared]: It FED? On a moth?  
> **Guide** [wry]: It's not picky.  
> **Hero** [curious]: …Another mark lit up.  
> **Guide** [thinking]: Means you can leave two of yourself behind now.  
> **Hero** [exhausted]: Wonderful. Twice the dying.  
> **Guide** [wry]: Twice the options.  
> **Guide** [thinking]: And one more thing. You can let go now, whenever you like.  
> **Hero** [curious]: Let go of what?  
> **Guide** [wry]: Yourself. Trust me, it's worse when you choose it.

## World 2 opening — *Into the ruins, a few steps in*
> **Hero** [thinking]: Will it hurt any less?  
> **Guide** [amused]: Nope!

Let "Nope!" end it. No explanation, no comfort. Keep exchanges like this in World 2 as the strain builds.

## Later story direction

- **The amulet grows stronger each world** (one rune per boss), not one big awakening: World 1, it brings him back (1 echo). After the moth, the 2nd rune: 2 echoes and self-destruct. After the tree, the 3rd rune: 3 echoes and recall.
- **World 2 — Overgrown ruins:** He can now choose when he dies, and it's worse than being killed. His frustration and exhaustion build, and the banter continues. He gets better at spotting the guide's half-truths and answering back. Give him space to challenge the guide's assumptions and learn what happened in the guide's timeline. Let a specific discovery or conflict earn a serious conversation; reveal that history through incidents rather than a single long explanation.
- **World 3 — Sanctum:** The third rune lets him recall his echoes, so a mistake no longer costs him more deaths. His growing control should come through planning and decisions; the pain remains real. The spectral stag tests everything he has learned.
- **Ending:** Preserve the planned image of the hero meeting a new version of himself and asking, “Which death are you currently on?” Before scripting it, settle what happens to the treasure, whether the amulet can be removed, and why he chooses or is forced to become the next guide.

## Open questions

- **Respawn versus timelines:** Normal play returns him to a checkpoint and leaves an echo. How that relates to the guide's other timeline needs one clear rule before anyone explains it. Avoid "your body forgets" as a substitute.
- **What the guide knows:** He met his own guide once; being the guide is new. Decide what differed in his timeline and what he can't predict, so his knowledge has a consistent basis (he forgot the moth, he's sure about the pit).
- **The tribe:** The shrines carry the amulet's symbol. Decide what the tribe is and what he finds out about them in World 2.
- **Save for later:** "How many times have you done this?" / "I stopped counting." fits a quieter moment, probably World 2.

Related: [ideas](IDEAS.md), [level plan](LEVELS.md), [in-game dialogue](../dialogue.js).
