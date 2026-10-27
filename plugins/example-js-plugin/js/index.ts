import { before } from "@revenge-mod/patcher";
import { getModules } from "@revenge-mod/modules/finders";
import { withProps } from "@revenge-mod/modules/finders/filters";

function tsundereifyMax(text, settings = {}) {
  const s = {
    intensity: 70,
    stutter: 35,
    shy: true,
    jealous: true,
    complimentPanic: true,
    affectionDenial: true,
    emojis: true,
    ...settings,
  };

  if (typeof text !== "string" || text.startsWith("/")) return text;

  // Protect URLs and inline code.
  const protectedParts = [];
  text = text.replace(
    /https?:\/\/\S+|`[^`]*`/g,
    (match) => {
      const id = protectedParts.length;
      protectedParts.push(match);
      return `\uE000${id}\uE001`;
    }
  );

  let result = text;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const chance = (percent) => Math.random() * 100 < percent;

  // 1. Phrase transformations: preserve what you meant to say.
  const replacements = [
    [/\bi love you\b/gi, "I-I love you... not that I'm embarrassed!"],
    [/\bi like you\b/gi, "I-I like you, okay?!"],
    [/\bi miss you\b/gi, "I-I missed you... a little!"],
    [/\bi appreciate you\b/gi, "I really appreciate you... s-so there!"],
    [/\bi'm proud of you\b/gi, "I-I'm proud of you! D-don't make it weird!"],
    [/\byou're cute\b/gi, "Y-you're cute, I guess..."],
    [/\byou look good\b/gi, "Y-you look good... not that I was looking!"],
    [/\bi'm sorry\b/gi, "I-I'm sorry, okay?!"],
    [/\bthank you\b/gi, "Th-thank you... I guess!"],
    [/\bthanks\b/gi, "Th-thanks! It's not like I owe you one!"],
    [/\byou're welcome\b/gi, "I-it was nothing! Don't get the wrong idea!"],
    [/\bno problem\b/gi, "N-no problem! It's not a big deal!"],
    [/\bi don't care\b/gi, "I-I don't care! ...Not that much, anyway."],
    [/\bwhatever\b/gi, "W-whatever!"],
    [/\bi'm embarrassed\b/gi, "I-I'm not embarrassed! S-shut up!"],
    [/\bi'm shy\b/gi, "I-I'm not shy! ...Maybe a little."],
    [/\bi'm lonely\b/gi, "I-I'm not lonely or anything..."],
    [/\bi'm bored\b/gi, "I'm b-bored... entertain me or something!"],
    [/\bi'm tired\b/gi, "I'm tired... d-don't worry about me!"],
    [/\bi'm scared\b/gi, "I-I'm not scared! ...Okay, maybe a little."],
    [/\bi need help\b/gi, "I-I need help... but don't laugh!"],
    [/\bi don't know\b/gi, "I-I don't know, okay?!"],
    [/\bi agree\b/gi, "I-I agree! Not that I'm agreeing with you on everything!"],
    [/\bi was wrong\b/gi, "F-fine, I was wrong! Happy now?!"],
    [/\bi was just joking\b/gi, "I-I was just joking! Don't take it seriously!"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (chance(s.intensity)) {
      result = result.replace(pattern, replacement);
    }
  }

  // 2. Compliment panic: only when your message contains a compliment.
  if (
    s.complimentPanic &&
    chance(s.intensity) &&
    /\b(cute|pretty|handsome|beautiful|gorgeous|adorable|amazing|talented|smart)\b/i.test(result)
  ) {
    result = result.replace(
      /\b(you're|you are)\s+(so\s+)?(cute|pretty|handsome|beautiful|gorgeous|adorable|amazing|talented|smart)\b/i,
      "$1 $2$3... n-not that I'm complimenting you!"
    );
  }

  // 3. Jealous style: only when your own message mentions jealousy.
  if (
    s.jealous &&
    chance(s.intensity) &&
    /\b(jealous|someone else|other girl|other boy|talking to them|with them instead|replaced me)\b/i.test(result)
  ) {
    result += pick([
      " ...I-I'm not jealous, okay?!",
      " Hmph! Do whatever you want...",
      " I-it doesn't bother me! Not at all!",
      " W-who said I cared?!",
      " ...it's not like I'm jealous or anything!",
      " Tch! I couldn't care less!",
    ]);
  }

  // 4. Affection denial: only when your message expresses affection.
  if (
    s.affectionDenial &&
    chance(s.intensity) &&
    /\b(love you|like you|miss you|care about you|appreciate you)\b/i.test(result) &&
    !/not that I'm embarrassed|don't get the wrong idea|not that I was looking/i.test(result)
  ) {
    result += pick([
      " N-not that you should get the wrong idea!",
      " It's not like I mean it THAT way!",
      " D-don't get all excited!",
      " ...I-it's not a big deal!",
    ]);
  }

  // 5. Big collection of nervous openers.
  const openers = [
    "U-um... ", "Uhh... ", "U-uh... ", "I-I mean... ",
    "W-well... ", "A-ah... ", "E-eh?! ", "H-huh?! ",
    "N-no, wait... ", "S-so... ", "O-oh... ", "U-ugh... ",
    "W-wait a second... ", "L-listen... ", "H-hey... ",
    "U-umm, ", "Ah, um... ", "E-erm... ", "I-it's just... ",
    "N-nevermind... ", "Y-you know... ", "W-whatever... ",
    "Hmph... ", "T-that is... ", "D-don't get the wrong idea, but ",
    "I-I wasn't going to say this, but ",
    "C-can I just say something...? ", "O-okay, so... ",
    "Ugh, fine... ", "A-anyway... ", "N-not that I care, but ",
    "J-just saying... ", "D-don't laugh, okay? ",
    "Th-this might sound weird, but ", "W-would you just listen?! ",
    "F-for the record... ", "I-it's not a big deal, but ",
    "S-shut up and listen... ", "P-please don't make this weird... ",
    "Ahhh, forget it... ", "H-hey, listen... ",
    "I-I have something to say... ", "D-don't misunderstand me... ",
    "N-not like it matters, but ", "Ugh, you're making me nervous... ",
    "W-why am I even saying this...? ", "A-anyway, forget that... ",
    "I-it's whatever... ", "O-okay, don't freak out... ",
  ];

  // 6. Nervous interruptions.
  const interruptions = [
    "— I-I mean, ", "... w-wait, ", " ah— ", " e-eh?! ",
    " h-huh? ", " n-nevermind, ", " o-okay, okay, ",
    " d-don't look at me like that, ", " i-it's not what you think, ",
    " w-well, obviously, ", " j-just listen, ", " gah— ",
    " ah, forget it, ", " I-I didn't say that! ",
    " d-did I say that out loud?! ", " n-not important! ",
    " ugh, whatever, ", " c-can you not?! ",
    " y-you're distracting me! ", " th-that's beside the point! ",
    " I-I'm being serious! ", " w-why are you making me say this?! ",
    " s-stop staring! ", " t-that came out wrong! ",
    " I-I can explain! ", " no, wait, that's not what I meant! ",
    " o-oh, come on! ", " d-don't misunderstand! ",
    " ...forget I said anything, ", " a-anyway, as I was saying, ",
    " h-hey, pay attention! ", " I wasn't ready to say that! ",
    " t-this is embarrassing! ", " j-just ignore that part! ",
    " w-why am I even explaining this?! ",
    " N-no, that's not it! ", " I-it sounded better in my head! ",
    " S-stop making this difficult! ", " I-I'm totally calm! ",
    " D-don't quote me on that! ", " F-forget that last part! ",
    " T-that wasn't supposed to come out! ", " W-why did I say that?! ",
    " I-it's not like I planned this! ", " G-get that look off your face! ",
    " N-not another word! ", " O-oh, shut up! ",
    " I-I wasn't talking to myself! ", " T-take that back! ",
  ];

  // 7. Nervous endings.
  const endings = [
    " ...o-okay?", " ...j-just saying!", " ...d-don't misunderstand!",
    " ...ugh, nevermind!", " ...it's not like I care!", " ...hmph!",
    " ...baka!", " ...I-I guess.", " ...whatever!",
    " ...don't make a big deal out of it!", " ...n-not that you asked!",
    " ...so there!", " ...got it?!", " ...d-dummy!",
    " ...don't laugh at me!", " ...I mean it!", " ...seriously!",
    " ...ugh, forget it!", " ...y-you know what I mean!",
    " ...I wasn't nervous or anything!", " ...there, I said it!",
    " ...happy now?!", " ...don't read too much into it!",
    " ...it's whatever!", " ...I-I didn't mean it like THAT!",
    " ...geez!", " ...you're impossible!", " ...tch!",
    " ...just shut up already!", " ...n-not that it matters!",
    " ...don't get used to it!", " ...I said what I said!",
    " ...okay, I'm done talking!", " ...can we move on now?!",
    " ...ugh, you're the worst!", " ...I-it's fine, okay?!",
    " ...no further questions!", " ...and don't you dare tease me!",
    " ...that's all I'm saying!", " ...I-I'll pretend I didn't say that!",
    " ...don't make me repeat myself!", " ...you heard me!",
    " ...not another word!", " ...I swear!",
    " ...I-I'm serious!", " ...tch, whatever!",
    " ...I don't wanna talk about it!", " ...just forget it, okay?!",
    " ...you better not tell anyone!", " ...I'm going to regret saying that!",
  ];

  // 8. Random typing quirks.
  const quirks = [
    [/\bokay\b/i, "o-okay"],
    [/\bwait\b/i, "w-wait"],
    [/\bwhat\b/i, "w-what"],
    [/\bwhy\b/i, "w-why"],
    [/\bplease\b/i, "p-please"],
    [/\bhey\b/i, "h-hey"],
    [/\bwell\b/i, "w-well"],
    [/\bI think\b/i, "I-I think"],
    [/\bI guess\b/i, "I-I guess"],
    [/\breally\b/i, "r-really"],
    [/\bmaybe\b/i, "m-maybe"],
    [/\bsorry\b/i, "s-sorry"],
    [/\bhello\b/i, "h-hello"],
    [/\blook\b/i, "l-look"],
    [/\blisten\b/i, "l-listen"],
    [/\bstop\b/i, "s-stop"],
    [/\bfine\b/i, "f-fine"],
    [/\bnever\b/i, "n-never"],
    [/\bjust\b/i, "j-just"],
    [/\bactually\b/i, "a-actually"],
    [/\bprobably\b/i, "p-probably"],
    [/\bseriously\b/i, "s-seriously"],
    [/\bdon't\b/i, "d-don't"],
    [/\bcan you\b/i, "c-can you"],
    [/\bI can\b/i, "I-I can"],
    [/\bI was\b/i, "I-I was"],
    [/\bI didn't\b/i, "I-I didn't"],
    [/\bI don't\b/i, "I-I don't"],
    [/\bI want\b/i, "I-I want"],
    [/\bI need\b/i, "I-I need"],
    [/\bI have\b/i, "I-I have"],
    [/\bI will\b/i, "I-I will"],
    [/\bI would\b/i, "I-I would"],
    [/\bI should\b/i, "I-I should"],
    [/\byou know\b/i, "y-you know"],
    [/\bdon't know\b/i, "d-don't know"],
    [/\bprobably not\b/i, "p-probably not"],
    [/\bof course\b/i, "o-of course"],
    [/\bwhatever\b/i, "w-whatever"],
  ];

  if (s.shy) {
    // Add a nervous opener sometimes.
    const alreadyHasOpener =
      /^(u-um|u-uh|i-i mean|w-well|a-ah|e-eh|h-huh|n-no, wait|n-nevermind|hmph|ugh, fine)/i
        .test(result.trim());

    if (!alreadyHasOpener && chance(s.intensity * 0.55)) {
      result = pick(openers) + result;
    }

    // Stutter one existing phrase occasionally.
    if (chance(s.stutter)) {
      const [pattern, replacement] = pick(quirks);
      result = result.replace(pattern, replacement);
    }

    // Add a mid-message interruption.
    const words = result.split(/\s+/);

    if (words.length >= 6 && chance(s.intensity * 0.45)) {
      const position = Math.floor(Math.random() * (words.length - 3)) + 2;
      words.splice(position, 0, pick(interruptions));
      result = words.join(" ");
    }

    // Add an ending sometimes.
    if (chance(s.intensity * 0.4)) {
      result += pick(endings);
    }
  }

  // 9. The ONLY emojis this transformer can add.
  if (s.emojis && chance(s.intensity * 0.35)) {
    result += pick([" 💢", " 😡", " 🤬"]);
  }

  // GENERAL TSUNDERE TEXT TRANSFORMATIONS
  // Adds variety throughout your message, not just at the edges.

  const generalPick = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  const generalChance = (percent) =>
    Math.random() * 100 < percent;

  if (s.shy) {
    // Transform common expressions into tsundere-style wording.
    const generalReplacements = [
      [/\bI guess so\b/gi, "I-I guess so, if you insist"],
      [/\bI suppose\b/gi, "I-I suppose, hmph"],
      [/\bI think so\b/gi, "I-I think so... probably"],
      [/\bI don't mind\b/gi, "I-I don't mind or anything"],
      [/\bI want to\b/gi, "I-I kinda want to"],
      [/\bI wanted to\b/gi, "I-I sort of wanted to"],
      [/\bI was thinking\b/gi, "I-I was kinda thinking"],
      [/\bI was wondering\b/gi, "I-I was just wondering"],
      [/\bI hope so\b/gi, "I-I hope so... not that I'm worried"],
      [/\bI understand\b/gi, "I-I understand, okay?!"],
      [/\bI remember\b/gi, "I-I remember that, obviously"],
      [/\bI noticed\b/gi, "I-I noticed, so what?!"],
      [/\bI knew it\b/gi, "I-I knew it! Not that I'm bragging!"],
      [/\bthat's true\b/gi, "T-that's true, I guess"],
      [/\byou're right\b/gi, "Y-you're right... don't get used to it!"],
      [/\byou're wrong\b/gi, "Y-you're wrong! Hmph!"],
      [/\bI can do it\b/gi, "I-I can do it myself!"],
      [/\bI can handle it\b/gi, "I-I can handle it, so don't worry!"],
      [/\bI'm fine\b/gi, "I-I'm fine! Stop worrying!"],
      [/\bit's fine\b/gi, "I-it's fine, okay?!"],
      [/\bit's okay\b/gi, "I-it's okay... I guess"],
      [/\bthat's fine\b/gi, "T-that's fine by me! Not that I care!"],
      [/\bI don't mind if you\b/gi, "I-I guess you can, if you want"],
      [/\bI want you to\b/gi, "I-I kinda want you to"],
      [/\bI was worried about you\b/gi, "I-I was a little worried about you, that's all!"],
      [/\bI was waiting for you\b/gi, "I-I wasn't waiting for you or anything!"],
      [/\bI was looking for you\b/gi, "I-I was just looking for you, okay?!"],
      [/\bI was thinking about you\b/gi, "I-I happened to think about you, that's all!"],
      [/\bI had fun\b/gi, "I-I had fun... I guess"],
      [/\bthat was fun\b/gi, "T-that was fun! Not that I'm admitting anything!"],
      [/\bI enjoyed that\b/gi, "I-I enjoyed that... a little"],
      [/\bI like this\b/gi, "I-I like this, okay?!"],
      [/\bI love this\b/gi, "I-I really like this! Not that I'm excited!"],
      [/\bI hate this\b/gi, "I-I absolutely hate this! Hmph!"],
      [/\bthat's embarrassing\b/gi, "T-that's embarrassing... don't look at me!"],
      [/\bthat's awkward\b/gi, "T-that's awkward... can we pretend that didn't happen?"],
      [/\bI'm confused\b/gi, "I-I'm confused, okay?! Explain it properly!"],
      [/\bI'm excited\b/gi, "I-I'm excited! N-not that you can tell!"],
      [/\bI'm nervous\b/gi, "I-I'm not nervous! ...Okay, maybe a little"],
      [/\bI forgot\b/gi, "I-I forgot, alright?! It happens!"],
      [/\bI made a mistake\b/gi, "I-I made a mistake! Don't make a big deal out of it!"],
      [/\bI didn't mean to\b/gi, "I-I didn't mean to, okay?!"],
      [/\bI didn't notice\b/gi, "I-I didn't notice! It's not like I was paying attention!"],
      [/\bI was joking\b/gi, "I-I was joking! Don't take it seriously!"],
      [/\bI was serious\b/gi, "I-I was being serious! Why would I lie?!"],
      [/\bI'm serious\b/gi, "I-I'm serious! Don't laugh!"],
      [/\bthat's interesting\b/gi, "T-that's kinda interesting, I guess"],
      [/\bthat makes sense\b/gi, "T-that actually makes sense..."],
      [/\bI agree with you\b/gi, "I-I agree with you, okay?! Don't look so pleased!"],
      [/\bI trust you\b/gi, "I-I trust you... so don't make me regret it!"],
      [/\bI believe you\b/gi, "I-I believe you! Don't make me say it twice!"],
      [/\bI forgive you\b/gi, "I-I forgive you... this time!"],
      [/\bI missed that\b/gi, "I-I missed that! Say it again, would you?!"],
      [/\bI need a minute\b/gi, "I-I need a minute to think, okay?!"],
      [/\bI have no idea\b/gi, "I-I have absolutely no idea!"],
      [/\bI'm not sure\b/gi, "I-I'm not sure... don't rush me!"],
      [/\bI changed my mind\b/gi, "I-I changed my mind! So what?!"],
      [/\bI was wrong about that\b/gi, "F-fine, I was wrong about that! Happy?!"],
      [/\bI don't believe it\b/gi, "I-I don't believe it! No way!"],
      [/\bthat's amazing\b/gi, "T-that's actually amazing... not that I'm impressed!"],
      [/\bthat's adorable\b/gi, "T-that's... kinda adorable! W-what?!"],
      [/\bthat's impressive\b/gi, "T-that's impressive! Don't get a big head!"],
      [/\bI can't believe it\b/gi, "I-I can't believe it! Seriously?!"],
      [/\bI give up\b/gi, "I-I give up! This is ridiculous!"],
      [/\bleave me alone\b/gi, "L-leave me alone! ...Just for a little while!"],
      [/\bcome here\b/gi, "C-come here! It's not like I want your attention!"],
      [/\bstay here\b/gi, "S-stay here, okay?! It's not a request!"],
      [/\bcome with me\b/gi, "C-come with me! I-I just don't want to go alone!"],
      [/\bI'm coming\b/gi, "I-I'm coming! Stop rushing me!"],
      [/\bwait for me\b/gi, "W-wait for me! Don't just leave!"],
      [/\bdon't leave\b/gi, "D-don't leave yet! I wasn't finished talking!"],
      [/\bI don't understand\b/gi, "I-I don't understand! Explain it again!"],
      [/\bthat's not fair\b/gi, "T-that's not fair! Hmph!"],
      [/\byou're annoying\b/gi, "Y-you're so annoying! ...Seriously!"],
      [/\byou're impossible\b/gi, "Y-you're absolutely impossible!"],
      [/\byou're unbelievable\b/gi, "Y-you're unbelievable! I swear!"],
      [/\byou're ridiculous\b/gi, "Y-you're ridiculous! Hmph!"],
      [/\bI'm not jealous\b/gi, "I-I'm NOT jealous! Get that through your head!"],
      [/\bI wasn't waiting\b/gi, "I-I wasn't waiting for you!"],
      [/\bI wasn't staring\b/gi, "I-I wasn't staring! Don't flatter yourself!"],
      [/\bI wasn't worried\b/gi, "I-I wasn't worried about you! Not even a little!"],
      [/\bI don't need you\b/gi, "I-I don't NEED you! ...Usually."],
      [/\bI can do it alone\b/gi, "I-I can do it alone! I don't need help!"],
      [/\bI was just curious\b/gi, "I-I was just curious! That's all!"],
      [/\bI didn't ask\b/gi, "I-I didn't ask! Hmph!"],
      [/\bwho cares\b/gi, "W-who even cares?! Not me!"],
      [/\bnever mind\b/gi, "N-nevermind! Forget I said anything!"],
      [/\bforget it\b/gi, "F-forget it! It's not important!"],
      [/\bthat's enough\b/gi, "T-that's enough! Don't push your luck!"],
      [/\bbe quiet\b/gi, "B-be quiet! You're distracting me!"],
      [/\bshut up\b/gi, "S-shut up! You're embarrassing me!"],
      [/\bdon't tease me\b/gi, "D-don't tease me! I'm serious!"],
      [/\bdon't laugh\b/gi, "D-don't laugh at me!"],
      [/\bdon't look at me\b/gi, "D-don't look at me like that!"],
      [/\bthat's not what I meant\b/gi, "T-that's not what I meant! D-don't twist my words!"],
      [/\byou misunderstood\b/gi, "Y-you misunderstood! It's not what you think!"],
      [/\bI said what I said\b/gi, "I-I said what I said! So there!"],
    ];

    for (const [pattern, replacement] of generalReplacements) {
      // Randomly transform individual matching phrases.
      if (generalChance(s.intensity * 0.65)) {
        result = result.replace(pattern, replacement);
      }
    }


    // Random language-independent stuttering.
    // Picks words from your actual message instead of matching English phrases.
    if (s.stutter > 0) {
      const words = [...result.matchAll(/\S+/gu)];

      // Only stutter a word if it looks like text, not punctuation alone.
      const candidates = words.filter((match) =>
        /[\p{L}\p{N}]/u.test(match[0]) &&
        !/^(https?:\/\/|www\.)/i.test(match[0]) &&
        !match[0].includes("\uE000")
      );

      // Chance for each eligible word to be stuttered.
      result = result.replace(/\S+/gu, (word) => {
        if (
          !/[\p{L}\p{N}]/u.test(word) ||
          /^(https?:\/\/|www\.)/i.test(word) ||
          word.includes("\uE000") ||
          !generalChance(s.stutter)
        ) {
          return word;
        }

        // Find the first letter or number, preserving punctuation before it.
        const match = word.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}])(.*)$/u);
        if (!match) return word;

        const [, punctuation, firstChar, rest] = match;

        // Avoid stuttering words that already start with a repeated character.
        if (rest.startsWith("-" + firstChar)) return word;

        return `${punctuation}${firstChar}-${firstChar}${rest}`;
      });
    }
    // General reactions embedded in the text, not just at the start/end.
    const insertions = [
      " (w-wait)",
      " (I-I'm serious!)",
      " (d-don't misunderstand!)",
      " (not that I care!)",
      " (h-hmph!)",
      " (I-I'm not blushing!)",
      " (w-what are you saying?! )",
      " (n-not like that!)",
      " (why am I explaining this...?)",
      " (ugh, forget it!)",
      " (I-I didn't say that!)",
      " (don't get the wrong idea!)",
      " (I wasn't worried!)",
      " (I-I'm totally calm!)",
      " (s-stop teasing me!)",
      " (I-it's not a big deal!)",
      " (t-that came out wrong!)",
      " (I-I can explain!)",
      " (I wasn't waiting!)",
      " (I-I'm not jealous!)",
      " (d-dummy...)",
      " (hmph!)",
      " (seriously, geez...)",
      " (why are you like this?! )",
      " (⊙⁠﹏⁠⊙)",
      " (；￣Д￣)",
      " (￣ヘ￣)",
      " (눈_눈)",
      " (¬_¬)",
      " (╬ Ò﹏Ó)",
      " (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
      " (〃￣ω￣〃ゞ)",
      " (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)",
      " (｡•́︿•̀｡)",
      " (๑•́ ₃ •̀๑)",
      " (￣^￣)",
      " (＞﹏＜)",
      " (ง'̀-'́)ง",
      " (╯°□°）╯︵ ┻━┻",
      " (ノಠ益ಠ)ノ彡┻━┻",
      " (≧ヘ≦)",
      " (；一_一)",
      " (￣^￣)ゞ",
      " (*/ω＼*)",
      " (⁄ ⁄•⁄-⁄•⁄ ⁄)",
      " (╥﹏╥)",
      " (๑•̀д•́๑)",
      " (눈‸눈)",
      " (¬､¬)",
      " (￣ε￣＠)",
      " (〃＞＿＜;〃)",
      " (ง •̀_•́)ง",
      " (•̀⤙•́)",
      " ( ˘︹˘ )",
      " (๑•̀ㅂ•́)و✧",
    ];

    // Add a random aside occasionally, without inventing a whole new message.
    if (generalChance(s.intensity * 0.25)) {
      const words = result.split(/\s+/);
      if (words.length >= 4) {
        const position = Math.floor(Math.random() * (words.length - 2)) + 2;
        words.splice(position, 0, generalPick(insertions));
        result = words.join(" ");
      }
    }

    // Rarely add a tsundere kaomoji. These are text faces, NOT emojis.
    if (generalChance(s.intensity * 0.2)) {
      result += generalPick([
        " ⊙⁠﹏⁠⊙",
        " (￣ヘ￣)",
        " (눈_눈)",
        " (¬_¬)",
        " (╬ Ò﹏Ó)",
        " (⁄ ⁄•⁄ω⁄•⁄ ⁄)",
        " (＞﹏＜)",
        " (≧ヘ≦)",
        " (눈‸눈)",
        " (•̀⤙•́)",
        " (￣^￣)",
        " (*/ω＼*)",
      ]);
    }
      }

  // Restore URLs and inline code exactly after every transformation has run.
  result = result.replace(
    /\uE000(\d+)\uE001/g,
    (_, id) => protectedParts[Number(id)]
  );

  return result;
}

export default plugin({
  start({ logger, cleanup }) {
    logger.log("Tsundere Messages loaded 💢");

    // Intercept outgoing messages and transform their text before Discord sends them.
    cleanup(
      getModules(withProps("sendMessage"), (module) => {
        const target =
          module?.default && typeof module.default.sendMessage === "function"
            ? module.default
            : module;
        if (!target || typeof target.sendMessage !== "function") return;

        cleanup(
          before(target, "sendMessage", (args) => {
            const message = args[1];

            if (typeof message === "string") {
              args[1] = tsundereifyMax(message);
            } else if (
              message &&
              typeof message === "object" &&
              typeof message.content === "string"
            ) {
              args[1] = {
                ...message,
                content: tsundereifyMax(message.content),
              };
            }

            return args;
          })
        );
      })
    );
  },
});
