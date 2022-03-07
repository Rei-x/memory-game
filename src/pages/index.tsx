import Head from 'next/head';
import NextImage from 'next/image';
import cloudinary from 'cloudinary';
import { Container } from 'react-bootstrap';
import { Images } from '@/types/cloudinaryImages';

export default function Home({ images }: { images: Images }) {
  return (
    <Container>
      <Head>
        <title>TypeScript starter for Next.js</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-center">ćpanie u kajtka</h1>
      <Container className="d-flex flex-wrap">
        {images.resources.map((image: any) => (
          <div key={image.asset_id} className="rounded inline-block">
            <NextImage src={image.url} width="80" height="80" />
          </div>
        ))}
      </Container>
    </Container>
  );
}

export async function getStaticProps() {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const images = (await cloudinary.v2.api.resources(
    {
      max_results: 25,
      type: `upload`,
      prefix: `cats`,
    },
    (err, result) => result,
  )) as Images;
  images.rate_limit_reset_at = null;
  return {
    props: {
      images,
    },
  };
}
