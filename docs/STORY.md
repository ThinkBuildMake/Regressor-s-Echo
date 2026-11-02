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

## Draft status

This document tracks what happens, why the characters act, and what they say. Dialogue and staging here have not been added to the game. Scenes 1–3 are being developed together. Later scenes are provisional continuations based on the existing World 1 level plan and need another pass against the personalities above before they become the story script.

## Expression and animation cues

Portrait expression names below match `FACES` in [dialogue.js](../dialogue.js). They refer to the dialogue portraits, not extra poses for the character in the level.

| Character | Available portrait expressions |
|---|---|
| Adventurer (`hero`) | `neutral`, `startled`, `pained`, `exhausted`, `determined`, `relieved`, `thinking`, `sad` |
| Guide (`guide`) | `wry`, `amused`, `solemn`, `sad`, `weary`, `skeptical`, `thinking`, `warm` |

The current world sprite supports idle, running, jumping, falling, and sliding. Stage conversations using idle, facing changes, pauses, portrait expressions, symbols, and effects. Pickup and equipping are implied by the amulet disappearing from the ground and appearing on his chest. Do not require arm gestures, inventory handling, or custom acting animations. Silent portrait cues are proposed staging; the current dialogue system would need support to display them without a spoken line.

## Scene 1 — One good find

**Place:** A quiet forest path among overgrown ruins. No immediate danger. The adventurer's satchel looks worn and full of ordinary supplies.

**Purpose:** Establish his modest ambition before the amulet turns it against him.

| Beat | Action / staging | Portrait expression | Dialogue |
|---|---|---|---|
| 1. Another disappointing day | He stands idle. Pause before the complaint. | Adventurer: `neutral` | **Adventurer:** “Mannn… treasure hunting's slow these days.” |
| 2. The daydream | He remains idle for a short daydreaming pause. | Adventurer: `thinking` | **Adventurer:** “One good find. That's all I need. Then I could relax. Take it easy for once.” |
| 3. Something catches his eye | He walks forward. A small glint shows through the dirt beside a broken stone. A **?** appears over his head. He stops. | Adventurer: `thinking` | **Adventurer:** “Hmm? What do we have here?” |
| 4. The discovery | He stops beside the amulet. On pickup, the ground item disappears; pause for inspection. | Adventurer: `thinking` | **Adventurer:** “An… amulet?” |
| 5. A little hope | Hold on the portrait as he considers its value. | Adventurer: `relieved` | **Adventurer:** “If this is pure gold, it could fetch me a pretty penny.” |
| 6. Where to put it | A metal cup and loose tools clink from his satchel. An **…** appears over his head while he stands idle. | Adventurer: `thinking` | — |
| 7. A practical mistake | He pauses as he decides how to carry it. | Adventurer: `thinking` | **Adventurer:** “It'll get scratched to bits in there.” |
| 8. Just for now | After the line, the amulet appears on his chest, implying he has put it on. | Adventurer: `neutral` | **Adventurer:** “Welp. I'll wear it for now.” |
| 9. The awakening | The amulet flashes gold. He stays in his idle pose; use the startled portrait to carry his reaction. As the flash fades, a blue-white ghost appears right beside him. Hold a short silent beat before either speaks. | Adventurer: `startled` | — |

**Staging notes:** The amulet should look like a lucky find before it looks magical. Let the satchel clink establish the scratching concern through sound; he does not need to explain his entire decision. Wearing it keeps both hands free and puts the find somewhere he can keep track of it. The flash comes only after the amulet appears on his chest. Keep the order: equip, gold flash, ghost appears beside him.

## Scene 2 — A familiar stranger

**Place:** The same spot, immediately after the flash. Treat this as a continuation of the discovery, even if the game uses a separate room for the conversation.

**Purpose:** Let the ghost discover that he has become the guide, then introduce the curse while giving the adventurer time to react.

**Delivery:** His opening is half to himself. Recognition precedes the joke; the sigh carries the weight of becoming the guide. Looking around uses facing changes, and the sigh uses sound and the `weary` portrait. No new gesture animations are required.

| Beat | Action / staging | Portrait expression | Dialogue |
|---|---|---|---|
| 1. Disoriented | The ghost appears after the gold flash. He faces one way, then the other, surveying the clearing. The adventurer remains idle, startled. | Guide: `thinking` | **Guide:** “Where am I?” |
| 2. Recognition | His search stops on the young adventurer: himself. Hold a silent beat, with the ghost facing him. | Guide: `solemn` | — |
| 3. The realization | He stays facing the adventurer as recognition turns into resignation. | Guide: `wry` | **Guide:** “Oh… must've died one too many times. I guess I'm the guide now.” |
| 4. A weary pause | An audible sigh; keep the floating idle pose. Let the pause land before he continues. | Guide: `weary` | — |
| 5. Getting on with it | He turns his attention fully to the bewildered adventurer. | Guide: `wry` | **Guide:** “Anyways, enough about me moping. Which death are you on right now?” |
| 6. Bewildered | The adventurer faces the ghost. His portrait carries the shock. | Adventurer: `startled` | **Adventurer:** “Wh—! Where did you come from?” |
| 7. The question sinks in | He stares at the ghost. | Adventurer: `thinking` | **Adventurer:** “Wait. Which death?” |
| 8. Recognition, for the guide | A small, tired smile. | Guide: `wry` | **Guide:** “First timer, then. Well. Introductions are in order.” |
| 9. Recognition, for the hero | The adventurer faces the ghost. Pause to let the matching face and clothes register. | Adventurer: `startled` | **Adventurer:** “You look like me.” |
| 10. The reveal | The guide's smile fades. | Guide: `solemn` | **Guide:** “I am you. From another timeline. A few thousand deaths ahead.” |
| 11. An awkward silence | Hold a long beat after “a few thousand deaths.” The adventurer stays idle, facing the ghost, then gives a short, nervous laugh. He is trying to talk himself out of believing any of this. | Adventurer: `startled` | **Adventurer:** “Ooook then. I must be dreaming.” |
| 12. Something to blame | Pause between thoughts as he settles on the amulet as an explanation. | Adventurer: `thinking` | **Adventurer:** “Must be this blasted amulet. I should never have put it on.” |
| 13. Calling it a day | He faces the spot where he found it. His voice becomes deliberately matter-of-fact, as if this can still be an ordinary bad day. | Adventurer: `neutral` | **Adventurer:** “I'll just leave it where I found it and call it a day.” |
| 14. The obvious solution | A brief gold pulse from the amulet and a failed-removal sound imply his attempt to take it off. Keep the world sprite idle. | Adventurer: `startled` | **Adventurer:** “Why won't it come off?” |
| 15. The curse | The guide floats in place as the gold pulse fades. | Guide: `solemn` | **Guide:** “It won't let go. And it won't let you stay dead.” |
| 16. Refusing to accept it | The adventurer turns back toward the ghost. He sounds irritated now, trying to hold on to something he can actually do. | Adventurer: `determined` | **Adventurer:** “Well, someone must know how to get it off. I'm not keeping it.” |
| 17. Giving in | The guide lets the objection hang for a moment. He has heard enough to recognize his own stubbornness. | Guide: `weary` | **Guide:** “Fine. If you must take it off, I'd start with the tribe that created the thing.” |
| 18. Something to look at | Hold on the amulet, with a small gold pulse to draw attention to its symbol. The guide stays in his floating idle pose. | Guide: `thinking` | **Guide:** “Look. See that symbol on it?” |
| 19. Following his attention | Pause while the adventurer considers the symbol. His irritation gives way to curiosity for a moment. | Adventurer: `thinking` | **Adventurer:** “What about it?” |
| 20. A lead | The guide faces farther into the forest. | Guide: `thinking` | **Guide:** “Go a little farther in. You should see a very similar one before long.” |
| 21. A reluctant agreement | The adventurer pauses, then faces the path ahead. He is accepting the lead, still unsure about the ghost. | Adventurer: `neutral` | **Adventurer:** “All right. I'll have a look. But if this is a waste of time, I'm going home.” |

**Delivery:** The guide initially goes along with the adventurer's insistence rather than launching into directions. Let “Fine” sound tired, with a trace of recognition. The symbol gives them something concrete to discuss before the adventurer decides to move on. He has not suddenly accepted the curse or decided to trust the ghost.

**Story details:** A tribe created the amulet, and a similar symbol farther into the forest provides the next lead. The guide suggests where to start; he does not promise that the tribe can remove it. The amulet resisting removal remains a proposed magical rule. The tribe's name, history, and present whereabouts are still unwritten.

## Scene 3 — The first death

**Place:** The first spike pit, too wide to cross in a single jump.

**Purpose:** Let the guide coax his younger self into the first jump. The adventurer is correctly judging his own limits; the guide knows that returning from death will give him another way across.

| Beat | Action / staging | Portrait expression | Dialogue |
|---|---|---|---|
| 1. Blocked | The adventurer stops at the edge, facing the far side. Hold a moment as he judges the gap. | Adventurer: `thinking` | **Adventurer:** “I'm not going to make it.” |
| 2. The private joke | A quiet snicker from the ghost. He stays in his floating idle pose, facing the adventurer. He already knows the catch. | Guide: `amused` | — |
| 3. Reassurance | Let the amusement settle into a small, knowing smile. | Guide: `wry` | **Guide:** “No, you'll be able to make it.” |
| 4. The obvious problem | The adventurer turns to face him, incredulous. | Adventurer: `startled` | **Adventurer:** “Look at it! There's no way I can make it. This gap is like twice the length I can jump.” |
| 5. Pressing his advantage | The guide holds his gaze. His voice is tired but certain, as if they are arguing over something he has already watched happen. | Guide: `wry` | **Guide:** “Trust me. I'm you from the future. I already know what's gonna happen.” |
| 6. One more push | Pause before the repeated reassurance. He offers no explanation of how the adventurer will make it across. | Guide: `amused` | **Guide:** “You'll make it. Trust me.” |
| 7. Reluctant trust | The adventurer faces the gap again. Hold a beat before returning control, giving him time to commit. | Adventurer: `determined` | **Adventurer:** “All right… here goes nothing.” |
| 8. Player action | Return control. The player attempts the crossing and dies to the spikes. The guide's earlier snicker is the joke; let the death itself land without another laugh or a triumphant sound. | — (gameplay) | — |
| 9. Return | The adventurer reappears at the checkpoint in idle. Let the cry come immediately, before he has time to understand what happened. | Adventurer: `pained` | **Adventurer:** “AGH, THAT HURT!” |
| 10. Something missing | Hold a beat as the initial pain settles into a more unsettling sensation. | Adventurer: `pained` | **Adventurer:** “It's like my soul was ripped in half.” |
| 11. The accusation | He turns to face the ghost and holds an accusing stare. Keep the world sprite idle; use the portrait and the emphasis on “trusted” to carry the anger. | Adventurer: `determined` | **Adventurer:** “I TRUSTED you.” |
| 12. A verbal shrug | The guide lets a short pause pass, then answers with casual, weary defensiveness. His `wry` portrait and delivery suggest a shrug; no shoulder animation is required. | Guide: `wry` | **Guide:** “Hey, it's not like you actually died, right?” |
| 13. The literal explanation | He continues matter-of-factly, as though this explains everything. Give “actually was” room to land. | Guide: `thinking` | **Guide:** “Besides, it feels like your soul was ripped in half because it actually was.” |
| 14. Redirecting his attention | The guide turns toward the spike pit, inviting the adventurer to look rather than continuing the argument. | Guide: `wry` | **Guide:** “Take a look at this.” |
| 15. The soul above the spikes | After the line, the guide floats toward the near edge of the pit. Return movement control so the player can follow safely. Hold the next exchange until the adventurer reaches the overlook: his blue-white soul hangs motionless in mid-air above the spikes. Keep the route and the soul visible. | — (gameplay) | — |

**Next beat to write:** The adventurer reacts to seeing the separated piece of his soul. The guide has brought him to the evidence; give that discovery room before explaining how to stand on it.


**Delivery:** The guide knows this will not be a permanent death. “You'll make it” means the adventurer will eventually cross, while the adventurer hears it as assurance that this jump will succeed. Keep the snicker small and weary; he finds his younger self's familiar objection amusing. His certainty and mischief should sit together. The adventurer's protest is reasonable, and agreeing to try is a reluctant act of trust.

**After the jump:** The guide deflects the accusation rather than apologizing. “It's not like you actually died” is his deliberately slippery way of saying the adventurer did not stay dead; the game still counts the death. His familiarity with returning has made him casual about something that is horrifying to his younger self. The soul being ripped in half is literal in this exchange. Seeing it should not immediately erase the adventurer's pain or anger.

**Staging requirement:** The guide moving toward the pit and the follow-up triggered at the overlook are proposed scene behavior, not currently implemented. Keep the adventurer on safe ground for the reveal; this beat does not require another jump.

## Remaining World 1 scenes — Working beats

These lines are a first pass to support the rooms in [LEVELS.md](LEVELS.md). Expand each into staging and individual beats after the opening is settled.

| Scene | Story beat | Proposed exchange |
|---|---|---|
| 4. The thorn wall | He starts asking practical questions, but still hesitates. Teach that a new death replaces his only echo. | **Adventurer** (`thinking`): “If I leave another one, what happens to the first?” **Guide** (`thinking`): “It disappears. You'll have to choose where you need it.” |
| 5. The patrol | The guide's casual delivery creates friction. His knowledge does not make the pain trivial. | **Guide** (`wry`): “The creature crosses the switch. Your echo could hold it down.” **Adventurer** (`exhausted`): “Easy for you to say.” **Guide** (`wry`): “Well, I already did my turn.” |
| 6. The chain | Reaching a shrine gives the hero a brief rest and room to ask about the guide. | **Adventurer** (`exhausted`): “How many times have you done this?” **Guide** (`weary`): “I stopped counting.” **Adventurer** (`thinking`): “That many?” **Guide** (`wry`): “You try keeping count. See how long you last.” |
| 7. The moth | He makes a plan using what he has learned. Fear remains; competence begins. | **Adventurer** (`thinking`): “The echo stopped its dust. If I can get above it…” **Guide** (`wry`): “You're getting the idea.” **Adventurer** (`determined`): “Try not to sound so surprised.” |
| 8. After the moth | A second rune lights on the amulet, unlocking a second echo. Continue into the World 2 opening below. | **Adventurer** (`thinking`): “Another mark lit up.” **Guide** (`thinking`): “You can hold on to two echoes now.” |

## World 2 opening — Any good news?

**Place:** The transition into the overgrown ruins, just after the second soul unlocks. Continue from the new rune lighting up after the moth; do not repeat the upgrade explanation.

| Beat | Action / staging | Portrait expression | Dialogue |
|---|---|---|---|
| 1. A little hope | The adventurer remains idle after hearing that he can hold two echoes. A pause as he considers whether the upgrade might have another benefit. | Adventurer: `thinking` | **Adventurer:** “Will this hurt any less?” |
| 2. A cheerful answer | The ghost smiles. Answer promptly, with an almost cheerful certainty. Hold a short beat afterwards so the lack of comfort lands. | Guide: `amused` | **Guide:** “Nope!” |

**Delivery:** Let “Nope!” end the exchange. The contrast between the adventurer's hope and the guide's smile is enough. No explanation or consoling follow-up is needed. Keep exchanges like this in World 2 as the physical and emotional strain builds.

## Agreed story direction to carry forward

- **The patrol:** Replace the guide's immediate remorse (“…It shouldn't be”) with “Well, I already did my turn.” He deflects the complaint through their shared history.
- **The shrine conversation:** Keep a glimpse of exhaustion in “I stopped counting,” then let him dodge further sympathy with a challenge. Save a sustained, vulnerable conversation for a specific event that earns it.
- **The moth:** Give the adventurer room to answer the guide's surprise with irritation. His growing competence should sharpen their banter.
- **The search for the tribe:** Pay off the promised symbol soon after the opening. Give them something to discover and react to between puzzles; their original reason for continuing needs to stay present. The exact discovery is still to be written.
- **The guide's predictions:** Preserve his confidence at the first pit, where he knows the outcome. Before later surprises, establish what he remembers, what differs, or what he is avoiding telling the adventurer. His knowledge should have a consistent basis.

The voice direction and revised later World 1 exchanges above are agreed. Scene staging and the surrounding dialogue remain open for scene-by-scene development. Keep the story moving through discoveries, disagreements, and banter; let serious moments arise from what happens to them.

## Later story direction

- **World 2 — Overgrown ruins:** His frustration and exhaustion build, and the banter continues. He gets better at spotting the guide's half-truths and answering back. Give him space to challenge the guide's assumptions and learn what happened in the guide's timeline. Let a specific discovery or conflict earn a serious conversation; reveal that history through incidents rather than a single long explanation.
- **World 3 — Sanctum:** The amulet awakens and allows him to release his soul deliberately. His growing control should come through planning and decisions; the pain remains real. The spectral stag tests everything he has learned.
- **Ending:** Preserve the planned image of the hero meeting a new version of himself and asking, “Which death are you currently on?” Before scripting it, settle what happens to the treasure, whether the amulet can be removed, and why he chooses or is forced to become the next guide.

## Continuity to settle as we write

- **Respawn versus timelines:** Normal gameplay returns him to a checkpoint and leaves an echo in the room. The exact relationship between that return and the guide's other timeline needs a clear rule before we write further explanations. Avoid “your body forgets” as a substitute for explaining it.
- **Guide knowledge:** He recognizes the role because he once met his own guide; becoming the guide is new to him. Decide what differed in his timeline and what he cannot predict. His opening suggests that one more death caused this transition; the exact rule remains to be settled.
- **Reason to continue:** The adventurer follows the guide's lead toward a symbol associated with the tribe that created the amulet, hoping to find a way to remove it. Decide what he discovers there before writing the next story scene.
- **Opening placement:** The current game separates the amulet pickup and ghost conversation into two rooms. The proposed opening has the ghost appear immediately after the adventurer puts it on; implementation will need to preserve that cause and effect.
- **Terminology:** “Echo” means the solid, standable soul left by a death. The guide floats, is translucent, and cannot serve as a platform. Gold belongs to the amulet; blue-white belongs to souls.

Related references: [Ideas and agreed direction](IDEAS.md), [level plan](LEVELS.md), and [current in-game dialogue](../dialogue.js).
