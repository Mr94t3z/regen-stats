import { Button, Frog, TextInput } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/middlewares'
import { Box, Divider, Image, Heading, Text, VStack, Spacer, vars } from "../lib/ui.js";
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
    height: 600,
    width: 600,
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
  const { fid } = c.var.interactor || {}

  try {
    const response = await fetch(`${baseUrlNeynarV2}/user/bulk?fids=${fid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY || '',
      },
    });

    const data = await response.json();
    const userData = data.users[0];

    return c.res({
      title: 'Regen Stats',
      image: (
        <Box
            grow
            alignVertical="center"
            backgroundColor="bg"
            padding="48"
            textAlign="center"
            height="100%"
            // border="1em solid rgb(254,253,251) "
            // borderRadius="22"
          >
            <VStack gap="4">
                {/* <Divider color="red" /> */}
                {/* <Spacer size="22" /> */}
                <Heading color="red" weight="900" align="center" size="64">
                  REGEN 🍄 STATS
                </Heading>
                {/* <Spacer size="22" /> */}
                {/* <Box 
                  borderStyle="solid" 
                  borderRadius="8"
                  borderWidth="2" 
                  borderColor="red" 
                  height="96" 
                  width="560" 
                /> */}
                <Divider color="red" />
                <Spacer size="22" />
                <Text align="center" color="grey" size="14">
                  Gift storage to the users you follow who are low on storage!
                </Text> <Text align="center" color="grey" size="14">
                  Powered by Arbitrum.
                </Text>
                <Spacer size="22" />
                <Divider color="red" />
                <Box flexDirection="row" justifyContent="center">
                    <Text color="black" align="center" size="14">created by</Text>
                    <Spacer size="10" />
                    <Text color="grey" decoration="underline" align="center" size="14"> @0x94t3z</Text>
                </Box>
            </VStack>
        </Box>
      ),
      intents: [
        <TextInput placeholder="Search by username" />,
        <Button action='/stats'>My Stats</Button>,
        <Button value="oranges">Search</Button>,
        <Button.Link href='https://warpcast.com/0x94t3z.eth'>Creator</Button.Link>,
        <Button.Link href={CAST_INTENS}>Share</Button.Link>,
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

app.frame('/stats', async (c) => {
  const { fid } = c.var.interactor || {}

  try {
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
      title: 'Regen Stats',
      image: (
        <Box
            grow
            alignVertical="center"
            backgroundColor="bg"
            padding="48"
            textAlign="center"
            height="100%"
            // border="1em solid rgb(254,253,251) "
          >
            <VStack gap="4">
                {/* <Divider color="red" /> */}
                {/* <Spacer size="22" /> */}
                <Heading color="red" font="playfair_display" weight="900" align="center" size="64">
                  REGEN 🍄 STATS
                </Heading>
                {/* <Spacer size="22" /> */}
                <Divider color="darkGrey" />
                <Spacer size="22" />
                <Box flexDirection="row" alignHorizontal="left" alignVertical="center">
                  {/* <Box 
                    borderStyle="solid" 
                    borderRadius="42"
                    borderWidth="4" 
                    borderColor="blue" 
                    height="64" 
                    width="64" 
                  >
                    <Image
                      borderRadius="38"
                      height="56"
                      width="56"
                      objectFit="cover"
                      src={userData.pfp_url}
                    />
                  </Box> */}

                  <img
                      height="80"
                      width="80"
                      src={userData.pfp_url}
                      style={{
                        borderRadius: "0%",
                        border: "3.5px solid #99A9B5",
                      }}
                    />
                  
                  <Spacer size="12" />
                    <Box flexDirection="column" alignHorizontal="left">
                      <Text color="black" align="left" size="24">
                        {userData.display_name}
                      </Text>
                      <Text color="grey" align="left" size="16">
                        @{userData.username}
                      </Text>
                    </Box>
                </Box>
                <Spacer size="22" />
                <Box
                  borderStyle="solid" 
                  borderRadius="8"
                  borderWidth="2" 
                  borderColor="darkGrey" 
                  padding="22"
                  height="96" 
                  width="100%" 
                >
                  <Box flexDirection="row" gap="8">
                    <Box flex="1" >
                      <Text color="black" align="start" size="32">
                        Allowance
                      </Text>
                    </Box>
                    <Spacer size="256" />
                    <Box flex="1">
                    {Number(allowance) <= 0 ? (
                      <Text color="red" align="end" size="14">
                        No allowance available.
                      </Text>
                     ) : (
                      <Text color="darkGrey" align="end" size="32">
                        {allowance}
                      </Text>
                    )}
                    </Box>
                  </Box>
                </Box>
                <Spacer size="22" />
                <Box
                  borderStyle="solid" 
                  borderRadius="8"
                  borderWidth="2" 
                  borderColor="darkGrey" 
                  padding="22"
                  height="128" 
                  width="100%" 
                ></Box>
                <Spacer size="22" />
                {/* <Divider color="red" /> */}
                <Box flexDirection="row" justifyContent="center">
                    <Text color="black" align="center" size="14">created by</Text>
                    <Spacer size="10" />
                    <Text color="grey" decoration="underline" align="center" size="14"> @0x94t3z</Text>
                </Box>
            </VStack>
        </Box>
      ),
      intents: [
        <TextInput placeholder="Search by username" />,
        <Button action='/'>My Stats</Button>,
        <Button value="oranges">Search</Button>,
        <Button.Link href='https://warpcast.com/0x94t3z.eth'>Creator</Button.Link>,
        <Button.Link href={CAST_INTENS}>Share</Button.Link>,
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

// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
