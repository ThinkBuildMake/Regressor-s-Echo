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
- **React in the moment.** A surprise gets a reaction right away, not after the other character has finished talking. People interrupt, talk over each other's confusion, and ignore each other when they're preoccupied.
- **Transitions are smooth, not abrupt.** The guide eases into things ("Oh, by the way…") rather than announcing them.
- **Suspicion is earned.** Once the guide has tricked him, the hero questions the guide's suggestions. Let that history colour later scenes.
- **Don't explain what the player can see.** Nobody says the moth heals; the player watches it happen. Leave mechanics unsaid when the room already shows them (a soul is solid, so it can weigh down a plate).
- **Teach before testing.** A boss mechanic is taught in an earlier room; during the fight the guide only nudges, and only after the player struggles ("I made it past here. There's a way."). Hints come after repeated deaths, getting a little more specific each time.
- **Reward moments get staging.** Beating a boss is a scene (glow, dissolve, absorb), not just a door opening.
- **Each world adds a rune and a power.** The guide names the new power in a line or two; the next room lets the player try it.
- **Keep the guide's mischief dry.** "Nope!" and "Where's the fun in that?" are the register: short, smiling, unhelpful at the right moment.

## Story spine

- **The tribe** built the amulet to cheat death. The marks lead through their ruins (World 2) to their pyramid temple. Carvings show many people wearing it, then fewer and fewer: it didn't save them, it used them up.
- **Deaths have a limit.** The guide believed they didn't. He reached floor 90 of the pyramid, ran out, and became a guide. His "…Oh." when he first sees the hero is that realization; he only explains it in World 2.
- **The loop:** every guide dies protecting his younger self after the stag, as the guide's own guide did for him. Before that, he hides a note behind a tree.
- **The game ends** with the hero walking into floor 1 of the pyramid, set on climbing the whole thing.

## World 1 script

The game's text lives in [dialogue.js](../dialogue.js); this is the source it's written from.

### 1. One good find — *The clearing, on entry*
> **Hero** [neutral]: Mannn… treasure hunting's slow these days.  
> **Hero** [thinking]: One good find. That's all I need. Then I could relax. Take it easy for once.

### 2. The find and the meeting — *touching the amulet; he picks it up*
> **Hero** [curious]: Hm? What's this?  
> **Hero** [excited]: An amulet… if that's pure gold, it'd fetch a pretty penny.  
> *(Tools clink in his satchel.)*  
> **Hero** [thinking]: It'd get scratched to bits in there, though. Welp. I'll wear it for now.  
> *(It appears on his chest and flashes gold. A beat later, a blue-white ghost fades in at his upper right.)*  
> **Hero** [startled]: WAH—!  
> **Hero** [scared]: Wh— where did you come from?!  
> *(The ghost looks one way, then the other, ignoring him.)*  
> **Guide** [thinking]: Where am I?  
> **Hero** [annoyed]: You're asking ME?  
> *(His eyes settle on the hero. A beat.)*  
> **Guide** [solemn]: …Oh.  
> *(A long beat. He realizes what he's become; the player only learns why in World 2.)*  
> **Guide** [wry]: Anyways. Which death are you on right now?  
> **Hero** [thinking]: Which… death?  
> **Guide** [amused]: A first-timer! Introductions, then.  
> **Hero** [curious]: Hang on. You look like me.  
> **Guide** [solemn]: I am you. From another timeline. A few thousand deaths ahead.  
> *(A long beat.)*  
> **Hero** [exhausted]: Ooook then. I must be dreaming.

He can move again.

### 3. The curse and the lead — *halfway to the clearing's exit*
> **Hero** [annoyed]: It's this blasted amulet. I'm leaving it right here.  
> *(A gold pulse: it won't come off.)*  
> **Hero** [startled]: …Why won't it come off?  
> **Guide** [solemn]: It won't let go. And it won't let you stay dead.  
> **Hero** [determined]: Then someone out there knows how to get it off.  
> **Guide** [weary]: …Fine. Start with the tribe that made it. See the mark on it?  
> **Hero** [thinking]: This squiggle?  
> **Guide** [thinking]: There's another one like it farther in.  
> **Hero** [neutral]: All right. But if this is a waste of time, I'm going home.

From here the guide appears only for conversations he's part of: he fades in at the hero's upper right and fades away once they're done.

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
> **Hero** [pained]: Am… I alive?  
> **Hero** [pained]: Why does it feel like someone scooped out half my insides?  
> **Guide** [wry]: Mm. That fades. Mostly.  
> **Hero** [annoyed]: You. You said I'd make it.  
> **Guide** [thinking]: And you will.  
> **Hero** [shouting]: I landed on SPIKES. I trusted you!  
> **Guide** [wry]: Hey, it's not like you actually died. …Well, sorta.  
> **Hero** [startled]: That's NOT better!  
> **Guide** [thinking]: That empty feeling's real, though. You left a piece of yourself out there.  
> **Hero** [shouting]: A PIECE OF ME?!  
> **Guide** [amused]: Seeing's believing. Come take a look.

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

### 8. The patrol — *on entry*
> **Guide** [thinking]: See that plate? It holds the door open, as long as something's on it.  
> **Hero** [exhausted]: Lemme guess. I gotta die again.  
> **Guide** [amused]: No longer a greenhorn, are ya?

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

*When he first touches the shrine:*
> **Hero** [curious]: Wait. That mark… it's the same as the one on the amulet.  
> **Guide** [wry]: Told you you'd see it before long.

### 10. The low door — *only after his soul first blocks the tunnel (room still to be built)*
> **Guide** [amused]: Well. You've locked yourself out. With yourself. That's a new one.

*The well and the turnaround are silent puzzle rooms.*

### 11. The moth arrives — *The moth, partway along the ledge, while walking*
> *(The ground shakes.)*  
> **Hero** [startled]: What's with this shaking… is this an earthquake?  
> **Guide** [surprised]: Oh shoot, it's been so long that I forgot. Be careful! Watch out for…  
> *(The moth bursts in through the right wall.)*  
> **Guide** [wry]: …that.

### 12. The dust — *after his 2nd death in the fight*
Blocking the dust with your soul should be taught in an earlier room, so the guide only nudges here. Dying heals the moth, but nobody says so; the player sees it.
> **Hero** [shouting]: That's impossible! There's nowhere to hide from that!  
> **Guide** [thinking]: I made it past here. There's a way.  
> **Hero** [annoyed]: Then tell me!  
> **Guide** [amused]: Where's the fun in that?

*After about 25 deaths there (each try costs about two, since dying heals the moth), one more nudge:*
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
> **Guide** [thinking]: The amulet absorbed it. Your soul's a little stronger now.  
> **Hero** [scared]: It ABSORBED it? A whole moth?  
> **Guide** [wry]: It's not picky.  
> **Hero** [curious]: …Another mark lit up.  
> **Guide** [thinking]: Means you can leave two of yourself behind now.  
> **Hero** [exhausted]: Wonderful. Twice the dying.  
> **Guide** [wry]: Twice the options.  
> **Hero** [thinking]: …Will it hurt any less?  
> **Guide** [amused]: Nope!  
> *(A beat. Let it land: no explanation, no comfort.)*  
> **Guide** [thinking]: And one more thing. You can let go now, whenever you like.  
> **Hero** [curious]: Let go of what?  
> **Guide** [wry]: Yourself. Trust me, it's worse when you choose it.

### 14. The nap — *straight on from 13*
He writes the note while the hero sleeps: he's incorporeal, so he drifts ahead to the old tree in World 3 and scratches it into the dirt there. Nothing gives it away until World 3 (a flashback could show it, but isn't needed).
> **Hero** [exhausted]: I need… a minute. Or a hundred.  
> **Guide** [wry]: Go on. I'll keep watch. Not like I sleep.  
> **Hero** [exhausted]: Wake me if anything else comes through a wall.  
> *(He lies down. The screen dims. The ghost watches him for a long moment.)*  
> **Guide** [thinking]: …  
> **Guide** [sad]: …  
> *(Morning. The screen brightens.)*  
> **Hero** [curious]: Did you just… sit there all night?  
> **Guide** [wry]: Floated. There's a difference.

## World 2 script: Overgrown Ruins

Rooms are in [LEVELS.md](LEVELS.md). Silent rooms: 3 Above the jump, 5 The spring, 6 The race.

### 1. Let go — *on entry (room 1)*
His first chosen death. Keys come from an on-screen prompt, not from the guide.
> **Hero** [thinking]: No spikes. No thorns. No bugs. …Why does that make it worse?  
> **Guide** [thinking]: Because this time, nothing's going to do it for you.  
> **Hero** [scared]: You mean I have to… on my own?  
> **Guide** [solemn]: Hold on to it. Feel it build. Let go early if you change your mind.  
> **Hero** [scared]: And if I don't let go?  
> **Guide** [wry]: Then you'll have something to stand on.

### 2. After the first chosen death — *he comes back*
> *(A beat.)*  
> **Hero** [sad]: …You were right. That's worse.  
> **Guide** [sad]: I know.  
> **Guide** [wry]: It gets easier. That's the bad part.

### 3. Off the edge — *on entry (room 2)*
> **Guide** [mischievous]: You know you don't have to stand still while you do it.  
> **Hero** [curious]: …Wait. I can keep going while it builds?  
> **Guide** [amused]: Took me forty tries to figure that out. You're welcome.

### 4. The beam — *on entry (room 4)*
> **Hero** [startled]: Whoa! What is THAT?  
> **Guide** [thinking]: The tribe's handiwork. Burns anything living that crosses it.  
> **Hero** [thinking]: Anything living.  
> **Guide** [wry]: You're catching on faster these days. It's unsettling.

### 5. The carvings — *The moving ledge (room 7), partway in*
The wall behind the room is carved; it needs its own background art.
> **Hero** [curious]: Hey. Look at the wall.  
> *(Carvings: a crowd of figures, each with a gold circle on its chest.)*  
> **Hero** [thinking]: They're all wearing it. The amulet.  
> **Guide** [solemn]: Keep going.  
> *(Further along: fewer figures. Then a handful. Then one.)*  
> **Hero** [scared]: Where'd everyone go?  
> **Guide** [solemn]: …  
> **Hero** [thinking]: It didn't save them. Did it.  
> **Guide** [sad]: It kept them going. That's not the same thing.  
> **Hero** [sad]: …  
> **Hero** [determined]: Well. I'm not ending up as a carving.  
> **Guide** [wry]: That's the spirit. Ha. Spirit.

### 6. Wrong order — *only after his 3rd death first erases a soul he needed (room 8)*
> **Guide** [amused]: Oldest goes first. Bit late now.  
> **Hero** [annoyed]: You could've mentioned that.  
> **Guide** [wry]: I could've.

### 7. The tree guardian arrives — *room 9, partway in*
> **Hero** [thinking]: Big tree. Old tree. Very… still tree.  
> **Guide** [warning]: Don't.  
> **Hero** [annoyed]: Don't what?  
> **Guide** [warning]: Don't say it's just a tree.  
> *(Its eyes open.)*  
> **Hero** [scared]: …It's not just a tree.

### 8. The slam — *after his 2nd and about his 25th deaths in the fight*
> **Hero** [shouting]: It smashed me! The other me! It keeps smashing me!  
> **Guide** [thinking]: Watch where it looks before it swings.

*After about 25:*
> **Guide** [thinking]: It always goes for the one closest to you. Use that.

### 9. The tree falls — *on the last stomp; same staging as the moth*
> **Hero** [exhausted]: Is it…  
> **Hero** [annoyed]: Don't you dare get back up.  
> *(It glows white and dissolves into motes that stream into him. He flashes white.)*  
> **Hero** [startled]: Again?!  
> **Guide** [thinking]: Third mark.  
> **Hero** [curious]: Three of me now. And…?  
> **Guide** [thinking]: And you can take them back. All of them, at once. Without dying.  
> **Hero** [relieved]: Finally. One that doesn't hurt.  
> **Guide** [wry]: Don't get used to it.

### 10. The guide's crack — *straight on from 9*
> **Hero** [thinking]: Hey. Can I ask you something?  
> **Guide** [wry]: You're going to anyway.  
> **Hero** [thinking]: In your timeline. Did you ever get it off?  
> *(A beat.)*  
> **Guide** [solemn]: …No.  
> **Guide** [thinking]: I followed the marks, same as you. All the way to the temple. A pyramid. Floor after floor.  
> **Hero** [curious]: How far did you get?  
> **Guide** [weary]: Ninety.  
> **Hero** [startled]: NINETY?  
> **Guide** [wry]: Don't look so impressed. It's not the top.  
> **Guide** [solemn]: I figured the deaths didn't have a limit. That I could just keep going until I got it right.  
> **Hero** [scared]: …They do?  
> **Guide** [sad]: Must. I'm here, aren't I?  
> **Hero** [sad]: …  
> **Guide** [mischievous]: Anyway! Better odds this time. You've got me.

## World 3 script: Sanctum

The grounds outside the tribe's pyramid. Silent rooms: 1 Three high, 3 The drop, 4 Three jobs, 5 Spring tower. The guide is quieter here; his care shows a little more.

### 1. The pyramid — *a few steps in*
The pyramid needs to be visible in the background, its top lost in cloud.
> **Hero** [startled]: …Whoa.  
> **Hero** [thinking]: That's it, isn't it. The temple.  
> **Guide** [solemn]: That's it.  
> **Hero** [thinking]: How many floors?  
> **Guide** [wry]: More than ninety.  
> **Hero** [determined]: …Then let's get to the front door.

### 2. In my own way — *on entry (room 2)*
> **Hero** [annoyed]: Great. My bridge is in my way.  
> **Guide** [amused]: Your bridge is you.  
> **Hero** [thinking]: …And I can take me back. Right.

### 3. Almost competent — *Everything (room 6), at its shrine*
> **Hero** [thinking]: You've been quiet.  
> **Guide** [wry]: Savoring it. You're almost competent.  
> **Hero** [cocky]: Almost?  
> **Guide** [warm]: …More than I was.

### 4. The breaking beam — *The rehearsal (room 7), after the beam first breaks a soul*
> **Hero** [startled]: It broke it! It broke my soul!  
> **Guide** [solemn]: Those beams don't push. They break. Whatever they hit doesn't come back.  
> **Hero** [scared]: Whatever?  
> **Guide** [thinking]: Keep it pointed away from what you need.

### 5. The promise — *by an old tree before the stag's arena*
> *(The guide stops. The hero walks a few steps before noticing.)*  
> **Hero** [curious]: What? You never stop.  
> **Guide** [thinking]: Can you promise me something?  
> **Hero** [annoyed]: …That depends.  
> **Guide** [warm]: After the next fight, go take a look behind this tree.  
> **Hero** [curious]: What's back there?  
> **Guide** [amused]: Nope! Not yet. No peeking.  
> **Hero** [annoyed]: You're doing the mysterious thing again.  
> **Guide** [warm]: Promise me.  
> **Hero** [exhausted]: …Fine. I promise.

### 6. The stag arrives — *room 8, partway in*
> *(Silence. Then hoofbeats, from everywhere at once.)*  
> **Hero** [scared]: Tell me you remember this one.  
> **Guide** [solemn]: I remember this one.  
> *(The spectral stag steps out of the light.)*  
> **Hero** [determined]: …Okay. Wall first. Then stomps.  
> **Guide** [warm]: Look at you, with a plan.

### 7. A nudge — *after about 10 deaths in the fight (the beam was taught in the room before)*
> **Guide** [thinking]: You did this an hour ago. Lead it away.

### 8. The guide's last stand — *on the last stomp*
"Eleven" and "Twelve" use the real death count for this fight (the guide's number, then one more).
> **Hero** [excited]: We did it! Did you see that? Three stomps, and I barely—  
> **Guide** [amused]: You died eleven times.  
> **Hero** [cocky]: Twelve. But who's counting?  
> **Guide** [warm]: Me. It was always me.  
> *(The stag's remains flicker blue. A beam gathers.)*  
> **Guide** [warning]: LOOK OUT!  
> *(The guide throws himself in front. A soul is a soul: his blocks it, but this beam breaks souls. He cracks like glass.)*  
> **Hero** [shouting]: NO—!  
> **Guide** [pained]: Ugh… I knew it would come to this.  
> **Guide** [weary]: Same thing happened last time. My guide did exactly this.  
> **Hero** [shouting]: You KNEW? Then why would you—  
> **Guide** [warm]: Because I knew.  
> **Guide** [warm]: I've watched over you. You're already doing better than I did. You'll get further.  
> **Guide** [solemn]: Just remember… the deaths aren't free. Count every one.  
> **Hero** [sad]: Don't— you can't just—  
> **Guide** [wry]: Hey.  
> **Guide** [warm]: I was never alive in the first place, right?  
> *(He fades.)*

### 9. The note — *behind the tree*
*(He keeps his promise. Behind the tree, a patch of earth has been smoothed flat, and words are scratched into it in his own handwriting.)*
> If you're reading this… then it must mean I've kicked the bucket.  
> Don't make that face. I can see it from here. Well. Could.  
> Here's what I didn't tell you, because you'd have argued, and I'd have lost. We always lose to ourselves.  
> The deaths have a limit. I don't know the number. I found it on floor ninety.  
> So don't spend them like I did. Think first. Die second.  
> Thanks for putting up with me. I know I'm not great company. I'd know.  
> Go get further than I did.  
> — You  
> P.S. The amulet's still not worth anything. I checked.

### 10. Floor one — *the pyramid's entrance; the game ends*
> **Hero** [sad]: …Idiot.  
> **Hero** [determined]: Ninety floors, huh.  
> **Hero** [determined]: Then I'm not stopping at ninety.  
> *(He walks in. Fade to the ending card.)*

## Content warning and ending card (in game)

**Content warning** (first screen; any key or click continues):
> This game shows a character dying many times, sometimes by his own choice, and deals with grief and self-sacrifice. Death is a puzzle mechanic here and is shown without gore.  
> If you're going through a hard time, please reach out to someone you trust or a local support line.

**Ending card** (after Floor one; the dialogue cue `theEnd` fades to it): "Floor 1" alone, then the title, "Deaths: N" (the whole run), "Count every one.", "Thank you for playing.", credits, and any key to play again.

## Later story direction

- **The amulet grows stronger each world** (one rune per boss), not one big awakening: World 1, it brings him back (1 echo). After the moth, the 2nd rune: 2 echoes and self-destruct. After the tree, the 3rd rune: 3 echoes and recall.
- **World 2 — Overgrown ruins:** He can now choose when he dies, and it's worse than being killed. His frustration and exhaustion build, and the banter continues. He gets better at spotting the guide's half-truths and answering back. Give him space to challenge the guide's assumptions and learn what happened in the guide's timeline. Let a specific discovery or conflict earn a serious conversation; reveal that history through incidents rather than a single long explanation.
- **World 3 — Sanctum:** The third rune lets him recall his echoes, so a mistake no longer costs him more deaths. His growing control should come through planning and decisions; the pain remains real. The spectral stag tests everything he has learned.
- **Ending:** Decided (see the World 3 script): the guide dies blocking the stag's soul-breaking beam, the hero reads his note, and walks into the pyramid's first floor.

## Open questions

- **Respawn versus timelines:** Normal play returns him to a checkpoint and leaves an echo. How that relates to the guide's other timeline needs one clear rule before anyone explains it. Avoid "your body forgets" as a substitute.
- **What the guide knows:** He met his own guide once; being the guide is new. Decide what differed in his timeline and what he can't predict, so his knowledge has a consistent basis (he forgot the moth, he's sure about the pit).
- **To build for the story:** the carved wall (World 2 room 7), the pyramid backdrop (World 3), an on-screen "hold" prompt for self-destruct, the stag's death count in the last stand, and triggers for "after a mistake" moments (a soul erased, a soul broken).
- **Save for later:** "How many times have you done this?" / "I stopped counting." fits a quieter moment, probably World 2.

Related: [ideas](IDEAS.md), [level plan](LEVELS.md), [in-game dialogue](../dialogue.js).
