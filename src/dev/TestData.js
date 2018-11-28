import * as audio from '../Audio';
import { Tools } from "../edit_screen/EditScreen";
import * as utils from "../utils/Utils";

function s(c) {
  return c*1000;
}
function m(c) {
  return s(c)*60;
}
function h(c) {
  return m(c)*60;
}
function programBuilder(name) {
  let programDuration = 0;
  let program = newEvent(name, programDuration, utils.noop);
  let elemStack = [program];
  return Object.freeze({
    loop(iterations) {
      addElem(newLoop(iterations));
      return this;
    },
    event(name, duration, callback) {
      addElem(newEvent(name, duration, callback));
      console.log({name, duration, callback});
      return this;
    },
    end() {
      elemStack.pop();
      return this;
    },
    build() {
      program.duration = calculateDuration(program);
      console.log("duration", program.duration);
      return program;
    }
  });

  function calculateDuration(parent) {
    return parent.children.reduce((a, b) => {
      if (b.element == Tools.event) {
        console.log("event", a + b.duration);
        return a + b.duration;
      } else {
        console.log("loop", a + calculateDuration(b) * b.iterations);
        return a + calculateDuration(b) * b.iterations;
      }
    }, 0);
  }

  function addElem(elem) {
    let parent = utils.last(elemStack);
    if (!parent) {
      throw new Error("DSL error, trying to add child to non existent parent. Check your 'end`s'.");
    }

    parent.children.push(elem);
    elemStack.push(elem);
  }
  function newLoop(iterations, children = []) {
    return { element: Tools.loop, iterations, children };
  }
  function newEvent(name, duration, callback, children = []) {
    return { element: Tools.event, name, duration, callback, children };
  }
}

let yogaProgram = {
  id: "Yoga",
  title: "Yoga",
  icon: "fas fa-dumbbell",
  description: `
    30s prep
    70s poses x 50
    01h total
  `,
  mainEvent: programBuilder( `Mindful Yoga` )
                     .event( `Preparation`,      s(30), audio.fsgong ).end()
                     .loop(50)
                       .event( `Hold pose %{i}`, s(70), audio.fgong  )
                         .event( `1/2`,          s(30), audio.ffgong ).end()
                         .event( `2/2`,          s(30), audio.ffgong ).end()
                       .end()
                     .end()
                     .event( `Chill`,            s(70), audio.sgong  )
                     .build()
};

let meditationProgram = {
  id: "Meditation",
  title: "Meditation",
  icon: "fas fa-brain",
  description: `
    20m Breathing
    15m Body
    05m Hearing
    03m Thoughts
    02m Ground
    01m Chill
  `,
  mainEvent: programBuilder( `Meditation` )
                     .event( `Preparation`, s(30), audio.fsgong ).end()
                     .event( `Breathing`,   m(20), audio.fgong  ).end()
                     .event( `Body`,        m(15), audio.fgong  ).end()
                     .event( `Hearing`,     m(5),  audio.fgong  ).end()
                     .event( `Thoughts`,    m(3),  audio.fgong  ).end()
                     .event( `Ground`,      m(2),  audio.fgong  ).end()
                     .event( `Chill`,       m(1),  audio.sgong  )
                     .build()
};

let absAthleanXProgram = {
  id: "Abs",
  title: "Abs",
  icon: "fas fa-table",
  description: `AthleanX ABS`,
  mainEvent: programBuilder( `Dem ABS` )
                     .event( `Preparation`,              s(10), audio.fsgong ).end()
                     .event( `Seated Ab Circles L`,      s(60), audio.fgong  ).end()
                     .event( `Preparation`,              s(3),  audio.fsgong ).end()
                     .event( `Seated Ab Circles R`,      s(60), audio.fgong  ).end()
                     .event( `Preparation`,              s(3),  audio.fsgong ).end()
                     .event( `Drunken Mountain Climber`, s(60), audio.fgong  ).end()
                     .event( `REST`,                     s(30), audio.fsgong ).end()
                     .event( `Marching Planks`,          s(60), audio.fgong  ).end()
                     .event( `Preparation`,              s(3),  audio.fsgong ).end()
                     .event( `Scissors`,                 s(60), audio.fgong  ).end()
                     .event( `Preparation`,              s(3),  audio.fsgong ).end()
                     .event( `Starfish Crunch`,          s(30), audio.fgong  ).end()
                     .event( `REST`,                     s(30), audio.fsgong ).end()
                     .event( `Russian 'V' Tuck Twist`,   s(30), audio.sgong  ).end()
                     .build()
};

let cardioProgram = {
  id: "Cardio",
  title: "Cardio",
  icon: "fas fa-heartbeat",
  description: `Simple HIIT 1min action/1min rest`,
  mainEvent: programBuilder( `1h HIIT Cardio` )
                     .event( `Preparation`, s(10), audio.fsgong ).end()
                     .loop(30)
                       .event( `Action`,    m(1),  audio.fgong  ).end()
                       .event( `Rest`,      m(1),  audio.fsgong ).end()
                     .end()
                     .event( `Chill`,       m(1),  audio.sgong  )
                     .build()
};

let chestProgram = {
  id: "Chest",
  title: "Chest",
  icon: "fas fa-user",
  description: `Sore in 6`,
  mainEvent: programBuilder(`Sore in 6 AthleanX Chest`)
                     .event( `Preparation`,         s(15), audio.fsgong ).end()
                     .event( `Dumbbell press`,      m(1),  audio.fgong  ).end()
                     .event( `Preparation`,         s(5),  audio.fsgong ).end()
                     .event( `Dumbbell pullover`,   m(1),  audio.fgong  ).end()
                     .event( `Preparation`,         s(5),  audio.fsgong ).end()
                     .event( `Dumbbell press fast`, s(30), audio.fgong  ).end()
                     .event( `Rest`,                s(30), audio.fsgong ).end()
                     .event( `Dumbbell pullover`,   m(1),  audio.fgong  ).end()
                     .event( `Preparation`,         s(5),  audio.fsgong ).end()
                     .event( `Dumbbell press`,      m(1),  audio.fgong  ).end()
                     .event( `Preparation`,         s(5),  audio.fsgong ).end()
                     .event( `Dumbbell press fast`, s(30), audio.fgong  ).end()
                     .event( `Preparation`,         s(5),  audio.fsgong ).end()
                     .event( `Spiderman pushups`,   s(30), audio.fgong  )
                     .build()
};

let testProgram = {
  id: "Test",
  default: true,
  title: "Test",
  icon: "fas fa-text-height",
  description: `
     ¯\\_(ツ)_/¯
  `,
  mainEvent: {
    name: `MainTimer`,
    duration: 10000,
    callback: audio.sgong,
    children: [
      {
        element: Tools.event,
        name: `l2_timer0`,
        duration: 2000,
        callback: audio.fsgong,
        children: []
      },
      {
        element: Tools.event,
        name: `l2_timer1`,
        duration: 7000,
        callback: audio.fgong,
        children: [
          {
            element: Tools.event,
            name: `l3_timer1.1`,
            duration: 3000,
            callback: audio.ffgong,
            children: []
          },
          {
            element: Tools.event,
            name: `l3_timer1.2`,
            duration: 3000,
            callback: audio.ffgong,
            children: []
          }
        ]
      }
    ]
  }
};

let programs = [yogaProgram, meditationProgram, absAthleanXProgram, cardioProgram, chestProgram, testProgram];
export { programs };