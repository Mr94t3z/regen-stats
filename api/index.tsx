import { Button, Frog } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/middlewares'
import { Box, Columns, Column, Image, Divider, Heading, Text, VStack, Spacer, vars } from "../lib/ui.js";
import dotenv from 'dotenv';

// Uncomment this packages to tested on local server
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';

// Load environment variables from .env file
dotenv.config();

const baseUrl = "https://warpcast.com/~/compose";
const text = "Check your $REGEN Stats 🍄\nFrame by @0x94t3z.eth";
const embedUrl = "https://regen-stats.vercel.app/api/frame";

const CAST_INTENS = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`;

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  ui: { vars },
  browserLocation: CAST_INTENS,
  imageAspectRatio: '1:1',
  imageOptions: {
    height: 1024,
    width: 1024,
  },
}).use(
  neynar({
    apiKey: process.env.NEYNAR_API_KEY || '',
    features: ['interactor', 'cast'],
  }),
)

// Neynar API base URL
const baseUrlNeynarV2 = process.env.BASE_URL_NEYNAR_V2;


app.frame('/', async (c) => {
  return c.res({
    title: 'Regen Stats',
    image: '/initial-image',
    intents: [
      <Button action='/stats'>My Stats</Button>,
      <Button.Link href='https://warpcast.com/0x94t3z.eth'>Creator</Button.Link>,
      // <Button.Link href={CAST_INTENS}>Share</Button.Link>,
    ],
  })
})


app.image('/initial-image', async (c) => {
  const number = 42000;

  const formattedNumber = number.toLocaleString();

  return c.res({
    headers: {
        'Cache-Control': 'max-age=0'
    },
    image: (
      <Box
          grow
          flexDirection="column"
          alignHorizontal="center"
          backgroundColor="blue"
          padding="48"
          textAlign="center"
          height="100%"
          gap="4"
        >

          <Column flexDirection="row" alignHorizontal="right" width="2/4" paddingTop="24" paddingBottom="24" paddingLeft="12">
            <Heading color="red" font="playfair_display" weight="900" align="center" size="48">
              REGEN
            </Heading>
              <Spacer size="6" />
              <Image
                  height="80"
                  width="80"
                  objectFit="cover"
                  src='https://www.regen.tips/_next/image?url=%2Fimages%2Flogos%2Fregen-token-logo.png&w=1080&q=75'
                />
              <Spacer size="6" />
            <Heading color="red" font="playfair_display" weight="900" align="center" size="48">
              STATS
            </Heading>
          </Column>
        
        <Spacer size="52" />
        
        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="white"
          height="128"
          width="100%"
        >
          <Columns gap="8" grow >
            <Column width="2/4" padding="2" flexDirection="row" alignHorizontal="left">
              <img
                height="150"
                width="150"
                src='https://avatars.githubusercontent.com/u/52822242?v=4'
                style={{
                  borderRadius: "0%",
                  border: "2px solid #FFFFFF",
                }}
              />
              <Column flexDirection="column" paddingLeft="16" paddingTop="12" paddingBottom="12">
                <Text color="white" align="left" size="20">
                  0x94t3z
                </Text>
                <Text color="darkGrey" align="left" size="16">
                  @{'0x94t3z.eth'}
                </Text>
              </Column>
            </Column>
            <Column flexDirection="row" alignHorizontal="right" width="2/4" paddingTop="24" paddingBottom="24" paddingLeft="12">
              <Text color="darkGrey" align="center" size="18">
                Fid 
              </Text>
              <Spacer size="10" />
              <Text color="white" align="center" size="18">
                397668
              </Text>
            </Column>
          </Columns>
        </Box>

        <Spacer size="22" />

        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="white"
          height="128"
          width="100%"
        >
          <Box grow flexDirection="row" gap="2">
              <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="white" align="center" size="18">
                  Allowance
                </Text>
                <Spacer size="10" />
                <Text color="red" align="center" size="14">
                  {formattedNumber}
                </Text>
              </Column>
            </Box>
            <Box flex="1">
            <Box
                backgroundColor="white"
                height="32"
                width="128"
                alignHorizontal="center"
                alignVertical="center"
              >
                <Text color="blue" align="center" size="18">
                Points
                </Text>
                
              </Box>
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="red" align="center" size="14">
                  28,481
                </Text>
              </Column>
            </Box>
            <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="white" align="center" size="18">
                  Remaining
                </Text>
                <Spacer size="10" />
                <Text color="red" align="center" size="14">
                  7,777
                </Text>
              </Column>
            </Box>
          </Box>
        </Box>

        <Spacer size="22" />

        <Box flexDirection="row" justifyContent="center">
            <Text color="white" align="center" size="14">created by</Text>
            <Spacer size="10" />
            <Text color="darkGrey" decoration="underline" align="center" size="14"> @0x94t3z</Text>
        </Box>
      </Box>
    ),
  })
})


app.frame('/stats', async (c) => {
  const { fid } = c.var.interactor || {}

  const embedUrlByUser = `${embedUrl}/stats/image/${fid}`;

  const SHARE_BY_USER = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrlByUser)}`;

  try {

    return c.res({
      title: 'Regen Stats',
      image: `/result-image/${fid}`,
      intents: [
        <Button action='/'>My Stats</Button>,
        <Button.Link href={SHARE_BY_USER}>Share</Button.Link>,
      ],
    })
  } catch (error) {
    return c.res({
      image: (
        <Box
            grow
            alignVertical="center"
            backgroundColor="bg"
            padding="48"
            textAlign="center"
            height="100%"
        >
            <VStack gap="4">
                <Spacer size="16" />
                <Heading color="red" weight="900" align="center" size="32">
                  ⚠️ Failed ⚠️
                </Heading>
                <Spacer size="22" />
                <Text align="center" color="black" size="16">
                   Uh oh, something went wrong!
                </Text>
                <Spacer size="22" />
                <Box flexDirection="row" justifyContent="center">
                    <Text color="black" align="center" size="14">created by</Text>
                    <Spacer size="10" />
                    <Text color="grey" decoration="underline" align="center" size="14"> @0x94t3z</Text>
                </Box>
            </VStack>
        </Box>
      ),
      intents: [
        <Button.Reset>Try again</Button.Reset>,
      ]
    });
  }
})


app.image('/result-image/:fid', async (c) => {
  const { fid } = c.req.param();

  const response = await fetch(`${baseUrlNeynarV2}/user/bulk?fids=${fid}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR_API_KEY || '',
    },
  });

  const data = await response.json();
  const userData = data.users[0];

  //schedule the query on a 6 hour interval, and then fetch by filtering for the user fid within the query results
  //dune query where each row is a unique fid and each column is a recommended set of users: https://dune.com/queries/3509966
  const meta = {
    "x-dune-api-key": process.env.DUNE_API_KEY || '',
  };

  const queryId = process.env.DUNE_QUERY_ALLOWANCE_ID;

  const header = new Headers(meta);

  const latest_response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results?&filters=fid=${fid}` //filter for single fid
  , {
    method: 'GET',
    headers: header,
  });

  const body = await latest_response.text();
  const responseJson = JSON.parse(body);

  let allowance = "0";

  if (responseJson.result && responseJson.result.rows.length > 0) {
    const recs = responseJson.result.rows[0];
    
    allowance = recs.allowance;
  }

  return c.res({
    headers: {
        'Cache-Control': 'max-age=0'
    },
    image: (
      <Box
          grow
          flexDirection="column"
          alignHorizontal="center"
          backgroundColor="blue"
          padding="48"
          textAlign="center"
          height="100%"
          gap="4"
        >

          <Column flexDirection="row" alignHorizontal="right" width="2/4" paddingTop="24" paddingBottom="24" paddingLeft="12">
            <Heading color="red" font="playfair_display" weight="900" align="center" size="48">
              REGEN
            </Heading>
              <Spacer size="6" />
              <Image
                  height="80"
                  width="80"
                  objectFit="cover"
                  src='https://www.regen.tips/_next/image?url=%2Fimages%2Flogos%2Fregen-token-logo.png&w=1080&q=75'
                />
              <Spacer size="6" />
            <Heading color="red" font="playfair_display" weight="900" align="center" size="48">
              STATS
            </Heading>
          </Column>
        
        <Spacer size="52" />
        
        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="white"
          height="128"
          width="100%"
        >
          <Columns gap="8" grow >
            <Column width="2/4" padding="2" flexDirection="row" alignHorizontal="left">
              <img
                height="150"
                width="150"
                src={userData.pfp_url}
                style={{
                  borderRadius: "0%",
                  border: "2px solid #FFFFFF",
                }}
              />
              <Column flexDirection="column" paddingLeft="16" paddingTop="12" paddingBottom="12">
                <Text color="white" align="left" size="20">
                  {userData.display_name}
                </Text>
                <Text color="darkGrey" align="left" size="16">
                  @{userData.username}
                </Text>
              </Column>
            </Column>
            <Column flexDirection="row" alignHorizontal="right" width="2/4" paddingTop="24" paddingBottom="24" paddingLeft="12">
              <Text color="darkGrey" align="center" size="18">
                Fid 
              </Text>
              <Spacer size="10" />
              <Text color="white" align="center" size="18">
                {fid}
              </Text>
            </Column>
          </Columns>
        </Box>

        <Spacer size="22" />

        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="white"
          height="128"
          width="100%"
        >
          <Box grow flexDirection="row" gap="2">
              <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="white" align="center" size="18">
                  Allowance
                </Text>
                <Spacer size="10" />
                {Number(allowance) <= 0 ? (
                  <Text color="red" align="center" size="12">
                    No allowance available.
                  </Text>
                  ) : (
                  <Text color="red" align="center" size="14">
                    {allowance.toLocaleString()}
                  </Text>
                )}
              </Column>
            </Box>
            <Box flex="1">
            <Box
                backgroundColor="white"
                height="32"
                width="128"
                alignHorizontal="center"
                alignVertical="center"
              >
                <Text color="blue" align="center" size="18">
                Points
                </Text>
                
              </Box>
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="red" align="center" size="14">
                  28,481
                </Text>
              </Column>
            </Box>
            <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="white" align="center" size="18">
                  Remaining
                </Text>
                <Spacer size="10" />
                <Text color="red" align="center" size="14">
                  7,777
                </Text>
              </Column>
            </Box>
          </Box>
        </Box>

        <Spacer size="22" />

        <Box flexDirection="row" justifyContent="center">
            <Text color="white" align="center" size="14">created by</Text>
            <Spacer size="10" />
            <Text color="darkGrey" decoration="underline" align="center" size="14"> @0x94t3z</Text>
        </Box>
      </Box>
    ),
  })
})

// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
