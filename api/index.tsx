import { Button, Frog } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/middlewares'
import { Box, Columns, Column, Image, Heading, Text, Spacer, vars } from "../lib/ui.js";
import sharp from 'sharp';
import dotenv from 'dotenv';

// Uncomment this packages to tested on local server
// import { devtools } from 'frog/dev';
// import { serveStatic } from 'frog/serve-static';

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
  headers: {
    'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate max-age=0, s-maxage=0',
  },
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

// Dune API query IDs
const queryAllowanceId = process.env.DUNE_QUERY_ALLOWANCE_ID;
const queryTipsReceivedId = process.env.DUNE_QUERY_TIPS_RECEIVED_ID;
const queryDailyTipsId = process.env.DUNE_QUERY_DAILY_TIPS_ID;

// Get the current date and time in UTC
const date = new Date();

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formattedDate = `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')} UTC`;


app.frame('/', async (c) => {
  return c.res({
    title: 'Regen Stats',
    image: '/dashboard-image',
    intents: [
      <Button action='/check-stats'>My Stats</Button>,
      <Button.Link href='https://warpcast.com/0x94t3z.eth'>Creator</Button.Link>,
    ],
  })
})


app.image('/dashboard-image', async (c) => {
  return c.res({
    headers: {
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate max-age=0, s-maxage=0',
    },
    image: (
      <Box
          grow
          flexDirection="column"
          alignHorizontal="center"
          backgroundColor="bg"
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
                  src='https://raw.githubusercontent.com/Mr94t3z/regen-stats/master/public/images/icon.png'
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
          padding="12"
          borderColor="red"
          height="96"
          width="100%"
        >
          <Columns gap="8" grow >
            <Column width="3/4" padding="2" flexDirection="row" alignHorizontal="left">
              <img
                height="128"
                width="128"
                src='https://raw.githubusercontent.com/Mr94t3z/regen-stats/master/public/images/my-pfp.png'
                style={{
                  borderRadius: "0%",
                  border: "2px solid #F3033E",
                }}
              />
              <Column flexDirection="column" paddingLeft="10" paddingTop="18" paddingBottom="18">
                <Text color="black" align="left" size="16">
                  0x94t3z
                </Text>
                <Text color="grey" align="left" size="12">
                  @{'0x94t3z.eth'}
                </Text>
              </Column>
            </Column>
            <Column flexDirection="row" alignHorizontal="right" width="1/4" paddingTop="26" paddingBottom="26" paddingLeft="12">
              <Text color="grey" align="center" size="16">
                Fid 
              </Text>
              <Spacer size="10" />
              <Text color="black" align="center" size="16">
                397668
              </Text>
            </Column>
          </Columns>
        </Box>

        <Spacer size="16" />

        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="red"
          height="128"
          width="100%"
        >
          <Box grow flexDirection="row" gap="2">
              <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="black" align="center" size="18">
                  Allowance
                </Text>
                <Spacer size="10" />
                <Text color="red" align="center" size="14">
                  42,000
                </Text>
              </Column>
            </Box>
            <Box flex="1">
            <Box
                backgroundColor="red"
                height="32"
                width="128"
                alignHorizontal="center"
                alignVertical="center"
              >
                <Text color="white" align="center" size="18">
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
                <Text color="black" align="center" size="18">
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

        <Spacer size="10" />

        <Box flexDirection="row" justifyContent="center">
            <Text color="red" align="center" size="12">({formattedDate})</Text>
        </Box>

        <Box flexDirection="row" justifyContent="center">
            <Text color="black" align="center" size="12">created by</Text>
            <Spacer size="4" />
            <Text color="grey" decoration="underline" align="center" size="12"> @0x94t3z</Text>
        </Box>
      </Box>
    ),
  })
})


app.frame('/check-stats', async (c) => {
  const { fid, username } = c.var.interactor || {}

  const embedUrlByUser = `${embedUrl}/results/${fid}/${username}`;

  const SHARE_BY_USER = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrlByUser)}`;

  try {

    return c.res({
      title: 'Regen Stats',
      image: `/image-results/${fid}/${username}`,
      intents: [
        <Button action={`/results/${fid}/${username}`}>My Stats</Button>,
        <Button.Link href={SHARE_BY_USER}>Share</Button.Link>,
      ],
    })
  } catch (error) {
    return c.error({
      message: 'Uh oh, something went wrong!',
    });
  }
})


app.frame('/results/:fid/:username', async (c) => {
  const { fid, username } = c.req.param();

  const embedUrlByUser = `${embedUrl}/results/${fid}/${username}`;

  const SHARE_BY_USER = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrlByUser)}`;

  try {

    return c.res({
      title: 'Regen Stats',
      image: `/image-results/${fid}/${username}`,
      intents: [
        <Button action='/check-stats'>My Stats</Button>,
        <Button.Link href={SHARE_BY_USER}>Share</Button.Link>,
      ],
    })
  } catch (error) {
    return c.error({
      message: 'Uh oh, something went wrong!',
    });
  }
})


app.image('/image-results/:fid/:username', async (c) => {
  const { fid, username } = c.req.param();

  // Get the current date and time in UTC
  const date = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formattedDate = `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')} UTC`;

  // Fetch the user's data from Neynar API
  const userResponse = await fetch(`${baseUrlNeynarV2}/user/bulk?fids=${fid}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR_API_KEY || '',
    },
  });

  const userData = await userResponse.json();
  const user = userData.users[0];

  // Fetch the user's profile picture
  const imageResponse = await fetch(user.pfp_url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
  }
  const imageArrayBuffer = await imageResponse.arrayBuffer();

  // Convert the WebP image to PNG using sharp
  const pngBuffer = await sharp(imageArrayBuffer).toFormat('png').toBuffer();

  const imageSrc = `data:image/png;base64,${pngBuffer.toString('base64')}`;

  // Process query results from Dune API (omitted for brevity, assuming same as your code)
  const header = new Headers({
    'x-dune-api-key': process.env.DUNE_API_KEY || '',
  });

  const [allowanceResponse, pointsResponse, remainingResponse] = await Promise.all([
    fetch(`https://api.dune.com/api/v1/query/${queryAllowanceId}/results?filters=fid=${fid}`, { headers: header }),
    fetch(`https://api.dune.com/api/v1/query/${queryTipsReceivedId}/results?filters=rx_fid=${fid}`, { headers: header }),
    fetch(`https://api.dune.com/api/v1/query/${queryDailyTipsId}/results?filters=tx_fname=${username}`, { headers: header })
  ]);

  const [allowanceData, pointsData, remainingData] = await Promise.all([
    allowanceResponse.json(),
    pointsResponse.json(),
    remainingResponse.json()
  ]);

  // Process query results
  const dailyAllowance = allowanceData.result?.rows[0]?.allowance || 0;
  const points = pointsData.result?.rows[0]?.total_tips || 0;
  const remainingAllowance = remainingData.result?.rows[0]?.allowance_remaining || 0;

  return c.res({
    headers: {
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate max-age=0, s-maxage=0',
    },
    image: (
      <Box
          grow
          flexDirection="column"
          alignHorizontal="center"
          backgroundColor="bg"
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
                  src='https://raw.githubusercontent.com/Mr94t3z/regen-stats/master/public/images/icon.png'
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
          padding="12"
          borderColor="red"
          height="96"
          width="100%"
        >
          <Columns gap="8" grow >
            <Column width="3/4" padding="2" flexDirection="row" alignHorizontal="left">
              <img
                height="128"
                width="128"
                src={imageSrc}
                style={{
                  borderRadius: "0%",
                  border: "2px solid #F3033E",
                }}
              />
              <Column flexDirection="column" paddingLeft="10" paddingTop="18" paddingBottom="18">
                <Text color="black" align="left" size="16">
                {user.display_name}
                </Text>
                <Text color="grey" align="left" size="12">
                  @{user.username}
                </Text>
              </Column>
            </Column>
            <Column flexDirection="row" alignHorizontal="right" width="1/4" paddingTop="26" paddingBottom="26" paddingLeft="12">
              <Text color="grey" align="center" size="16">
                Fid 
              </Text>
              <Spacer size="10" />
              <Text color="black" align="center" size="16">
                {fid}
              </Text>
            </Column>
          </Columns>
        </Box>

        <Spacer size="16" />

        <Box 
          borderStyle="solid"
          borderWidth="1"
          padding="24"
          borderColor="red"
          height="128"
          width="100%"
        >
          <Box grow flexDirection="row" gap="2">
              <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="black" align="center" size="18">
                  Allowance
                </Text>
                <Spacer size="10" />
                {dailyAllowance <= 0 ? (
                  <Text color="grey" align="center" size="12">
                    0
                  </Text>
                  ) : (
                  <Text color="red" align="center" size="14">
                    {dailyAllowance.toLocaleString()}
                  </Text>
                )}
              </Column>
            </Box>
            <Box flex="1">
            <Box
                backgroundColor="red"
                height="32"
                width="128"
                alignHorizontal="center"
                alignVertical="center"
              >
                <Text color="white" align="center" size="18">
                Points
                </Text>
              </Box>
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
              {points <= 0 ? (
                <Text color="grey" align="center" size="12">
                  0
                </Text>
                ) : (
                <Text color="red" align="center" size="14">
                  {points.toLocaleString()}
                </Text>
              )}
              </Column>
            </Box>
            <Box flex="1">
              <Column flexDirection="column" paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10">
                <Text color="black" align="center" size="18">
                  Remaining
                </Text>
                <Spacer size="10" />
                {remainingAllowance <= 0 ? (
                  <Text color="grey" align="center" size="12">
                    0
                  </Text>
                  ) : (
                  <Text color="red" align="center" size="14">
                    {remainingAllowance.toLocaleString()}
                  </Text>
                )}
              </Column>
            </Box>
          </Box>
        </Box>

        <Spacer size="10" />

        <Box flexDirection="row" justifyContent="center">
            <Text color="red" align="center" size="12">
              ({formattedDate})
            </Text>
        </Box>

        <Box flexDirection="row" justifyContent="center">
            <Text color="black" align="center" size="12">created by</Text>
            <Spacer size="4" />
            <Text color="grey" decoration="underline" align="center" size="12"> @0x94t3z</Text>
        </Box>
      </Box>
    ),
  })
})

// Uncomment for local server testing
// devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
