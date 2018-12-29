import { noop, fgong, ffgong, sgong, fsgong } from '../EventCallbacks';
import ToolNames from "../edit_screen/tools/ToolNames";
import { last } from "../utils/Utils";
import { s, m } from "../utils/TimeUtils";

function programBuilder(name) {
  let programDuration = 0;
  let program = newEvent(name, programDuration, noop);
  let elemStack = [program];
  return Object.freeze({
    loop(iterations) {
      addElem(newLoop(iterations));
      return this;
    },
    event(name, duration, callback = noop) {
      addElem(newEvent(name, duration, callback));
      return this;
    },
    end() {
      elemStack.pop();
      return this;
    },
    build() {
      program.duration = calculateDuration(program);
      return program;
    }
  });

  function calculateDuration(parent) {
    return parent.children.reduce((a, b) => {
      if (b.element == ToolNames.event) {
        return a + b.duration;
      } else {
        return a + calculateDuration(b) * b.iterations;
      }
    }, 0);
  }

  function addElem(elem) {
    let parent = last(elemStack);
    if (!parent) {
      throw new Error("DSL error, trying to add child to non existent parent. Check your 'end`s'.");
    }

    parent.children.push(elem);
    elemStack.push(elem);
  }
  function newLoop(iterations, children = []) {
    return { element: ToolNames.loop, iterations, children };
  }
  function newEvent(name, duration, callback, children = []) {
    return { element: ToolNames.event, name, duration, callback, children };
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
                     .event( `Preparation`,      s(30), ffgong ).end()
                     .loop(50)
                       .event( `Hold pose {i}`, s(60) )
                         .event( `1/2`,          s(30), fsgong ).end()
                         .event( `2/2`,          s(30), fsgong ).end()
                       .end()
                       .event( `Change pose`,  s(10), ffgong ).end()
                     .end()
                     .event( `Chill`,            s(70), sgong  )
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
                     .event( `Preparation`, s(30), fsgong ).end()
                     .event( `Breathing`,   m(20), fgong  ).end()
                     .event( `Body`,        m(15), fgong  ).end()
                     .event( `Hearing`,     m(5),  fgong  ).end()
                     .event( `Thoughts`,    m(3),  fgong  ).end()
                     .event( `Ground`,      m(2),  fgong  ).end()
                     .event( `Chill`,       m(1),  sgong  )
                     .build()
};

let absAthleanXProgram = {
  id: "Abs",
  title: "Abs",
  icon: "fas fa-table",
  description: `AthleanX ABS`,
  mainEvent: programBuilder( `Dem ABS` )
                     .event( `Preparation`,              s(10), fsgong ).end()
                     .event( `Seated Ab Circles L`,      s(60), fgong  ).end()
                     .event( `Preparation`,              s(3),  fsgong ).end()
                     .event( `Seated Ab Circles R`,      s(60), fgong  ).end()
                     .event( `Preparation`,              s(3),  fsgong ).end()
                     .event( `Drunken Mountain Climber`, s(60), fgong  ).end()
                     .event( `REST`,                     s(30), fsgong ).end()
                     .event( `Marching Planks`,          s(60), fgong  ).end()
                     .event( `Preparation`,              s(3),  fsgong ).end()
                     .event( `Scissors`,                 s(60), fgong  ).end()
                     .event( `Preparation`,              s(3),  fsgong ).end()
                     .event( `Starfish Crunch`,          s(30), fgong  ).end()
                     .event( `REST`,                     s(30), fsgong ).end()
                     .event( `Russian 'V' Tuck Twist`,   s(30), sgong  ).end()
                     .build()
};

let cardioProgram = {
  id: "Cardio",
  title: "Cardio",
  icon: "fas fa-heartbeat",
  description: `Simple HIIT 1min action/1min rest`,
  mainEvent: programBuilder( `1h HIIT Cardio` )
                     .event( `Preparation`, s(10), fsgong ).end()
                     .loop(30)
                       .event( `Action`,    m(1),  fgong  ).end()
                       .event( `Rest`,      m(1),  fsgong ).end()
                     .end()
                     .event( `Chill`,       m(1),  sgong  )
                     .build()
};

let chestProgram = {
  id: "Chest",
  title: "Chest",
  icon: "fas fa-user",
  description: `Sore in 6`,
  mainEvent: programBuilder(`Sore in 6 AthleanX Chest`)
                     .event( `Preparation`,         s(15), fsgong ).end()
                     .event( `Dumbbell press`,      m(1),  fgong  ).end()
                     .event( `Preparation`,         s(5),  fsgong ).end()
                     .event( `Dumbbell pullover`,   m(1),  fgong  ).end()
                     .event( `Preparation`,         s(5),  fsgong ).end()
                     .event( `Dumbbell press fast`, s(30), fgong  ).end()
                     .event( `Rest`,                s(30), fsgong ).end()
                     .event( `Dumbbell pullover`,   m(1),  fgong  ).end()
                     .event( `Preparation`,         s(5),  fsgong ).end()
                     .event( `Dumbbell press`,      m(1),  fgong  ).end()
                     .event( `Preparation`,         s(5),  fsgong ).end()
                     .event( `Dumbbell press fast`, s(30), fgong  ).end()
                     .event( `Preparation`,         s(5),  fsgong ).end()
                     .event( `Spiderman pushups`,   s(30), sgong  )
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
    element: ToolNames.event,
    name: `MainTimer`,
    duration: 10000,
    callback: sgong,
    children: [
      {
        element: ToolNames.event,
        name: `l2_timer0`,
        duration: 2000,
        callback: fsgong,
        children: []
      },
      {
        element: ToolNames.event,
        name: `l2_timer1`,
        duration: 7000,
        callback: fgong,
        children: [
          {
            element: ToolNames.event,
            name: `l3_timer1.1`,
            duration: 3000,
            callback: ffgong,
            children: []
          },
          {
            element: ToolNames.event,
            name: `l3_timer1.2`,
            duration: 3000,
            callback: ffgong,
            children: []
          }
        ]
      }
    ]
  }
};

let programs = [yogaProgram, meditationProgram, absAthleanXProgram, cardioProgram, chestProgram, testProgram];
export { programs };