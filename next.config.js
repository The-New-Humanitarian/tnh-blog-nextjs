module.exports = {
	images: {
		domains: ['images.ctfassets.net', 'videos.ctfassets.net'],
	},
	async redirects() {
		return [
			{
				source: '/car',
				destination: '/car/en',
				permanent: true,
			},
		]
	},
	compiler: {
		// Enables the styled-components SWC transform
		styledComponents: true,
	},
	// async headers() {
	//   return [
	//     {
	//       // matching all API routes
	//       source: '/:path*',
	//       headers: [
	//         { key: 'Access-Control-Allow-Credentials', value: 'true' },
	//         { key: 'Access-Control-Allow-Origin', value: '*' },
	//         {
	//           key: 'Access-Control-Allow-Methods',
	//           value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
	//         },
	//         {
	//           key: 'Access-Control-Allow-Headers',
	//           value:
	//             'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
	//         },
	//       ],
	//     },
	//   ]
	// },
}
