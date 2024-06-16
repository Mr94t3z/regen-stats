import { createSystem } from "frog/ui";

export const { Box, Row, Rows, Columns, Column, Divider, Image, Heading, Text, VStack, Spacer, vars } = createSystem({
  colors: {
    bg: "rgb(254,253,251)",
    white: "white",
    black: "rgb(53,45,57)",
    red: "rgb(243,3,62)",
    tosca: "rgb(157,204,237)",
    blue: "rgb(17,54,93)",
    purple: "rgb(48,13,79)",
    pink: "rgb(253,145,158)",
    darkGrey: "rgb(153,169,181)",
    grey: "rgba(128, 128, 128, 0.75)",
  },
  frames: {
    height: 1024,
    width: 1024,
  },
  fonts: {
    default: [
      {
        name: "JetBrains Mono",
        source: "google",
      },
    ],
    playfair_display: [
        {
          name: 'Playfair Display',
          source: 'google',
        },
      ],
  },
});


export const system = createSystem({
    frame: {
      height: 1024,
      width: 1024,
    }
  })