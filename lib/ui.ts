import { createSystem } from "frog/ui";

export const { Box, Row, Rows, Columns, Column, Divider, Image, Heading, Text, VStack, Spacer, vars } = createSystem({
  colors: {
    bg: "rgb(254,253,251)",
    white: "white",
    black: "rgb(53,45,57)",
    red: "rgb(244,6,63)",
    tosca: "rgb(157,204,237)",
    blue: "rgb(18,169,255)",
    darkGrey: "rgb(153,169,181)",
    grey: "rgba(128, 128, 128, 0.75)",
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