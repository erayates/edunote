
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Project Title

This project aims to create a web application that enables users to take notes from various sources such as YouTube, PDFs, and audio recordings, using AI to generate notes automatically. Additionally, users can search for notes within their collection and a public database of notes.


<!-- ## Badges

Add badges from somewhere like: [shields.io](https://shields.io/) -->

<!-- [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0) -->


## Demo

Insert gif or link to demo


## Features

- **Note-taking from multiple sources:** Text, PDFs, Word documents, audio recordings, images.
- **AI-powered note creation:** Converting audio or video to text, summarizing text, extracting keywords, topic classification.
- **Collaboration:** Share your notes in public and reach others.
- **Personalization:** Improved user experience with learning-based features with Gemini to create notes in personalized styles.
- **Smart search:** Search for public notes or specific information in your notes. Full-text search, semantic search, filtering, suggested searches.
- **Integrations:** Integration with other applications (Google Drive, Evernote, Zoom, etc.).


## Screenshots

![App Screenshot](Docs/readme_ss_1.png)


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Documentation

[Documentation](https://linktodocumentation)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## Support

For support, email fake@fake.com or join our Slack channel.


## Contributing

Please contact to contribute.

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

