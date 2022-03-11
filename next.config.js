module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 't3.ftcdn.net'],
  },
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'userId',
          },
        ],
        permanent: false,
        destination: '/',
      },
    ];
  },
};
