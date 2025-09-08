## Guide: Deploying Your Movie Website on Cloudflare Pages
This guide will walk you through the entire process of setting up a movie website template, securing your TMDB API key, preparing your logos, and deploying it for free on Cloudflare's global network.

## Prerequisites
Before you begin, make sure you have the following:
- A GitHub Account: For Website Template.
- A TMDB Account: To get the necessary API key. If you don't have one, you can sign up for free at themoviedb.org.
- A Cloudflare Account: To host your website. Sign up for free at cloudflare.com.

## Steps
Step 1: Get Your TMDB API Key
Your website will need to communicate with The Movie Database (TMDB) to fetch movie information. This is done via an API key.
- Log in to your TMDB account (Sign up, if you don't have one. It's free.).
- Navigate to your Account Settings by clicking your profile icon.
- In the left sidebar, click on the API section.
- Under the "Request an API Key" section, click to apply for a Developer key.
- Fill out the required information about your project. Be sure to accept the terms of use.
- Once approved, you will see your API Key (v3 auth). Copy this key and save it somewhere safe. This is your secret key.

Step 2: Setup your Own Webpage
First, you need to get the website template repository in your own account.
- Fork this repository.
- Make some changes (either you clone it locally to edit it or use github [codespace](https://github.com/codespaces) for virtual IDE).
    - Website Name (Make sure to double check each HTML file. You can search in repository each instance of: Website Name, websitename and WEBSITENAME so you can find them easily which to edit.)
    - websitename.ico (Placed in websitename/img/websitename.ico)
    - websitename.png (Placed in websitename/img/websitename.png)
<img width="312" height="431" alt="image" src="https://github.com/user-attachments/assets/2170490b-a5f9-4d9a-a1d6-4ae1f5f9080d" />

Step 3: Publish in Cloudflare - Pages
After you modify the website template, it's time for you to publish it in Cloudflare.

- Log in to your Cloudflare dashboard. (Sign up, if you don't have one. It's free.).
- Go to Workers & Pages.
  
<img width="251" height="487" alt="image" src="https://github.com/user-attachments/assets/4e83e961-7f42-45b0-ac92-96c3b0db45b3" />

- Create.

<img width="665" height="219" alt="image" src="https://github.com/user-attachments/assets/1e006da0-e706-4153-ab80-1cb13d42033e" />

- In Pages, import an existing Git repository and wait until deployed.

<img width="662" height="391" alt="image" src="https://github.com/user-attachments/assets/878bb955-132e-43c0-8157-d380e506f925" />

- Then go to Settings (of your project) > Variables and Secrets > Add.
    - Type: Secret
    - Name: Name-it-anything-you-want.
    - Value: Paste-the-API-Key-from-TMDB
    - Save.
  
<img width="1006" height="244" alt="image" src="https://github.com/user-attachments/assets/546cbd2c-a768-4cf3-8a15-0505f0cdc196" />

- Go to Deployment, click View Builds of the most recent builds. (Retry Deployment), to apply the Variables and Secrets into your website.

<img width="403" height="300" alt="image" src="https://github.com/user-attachments/assets/88906c6a-a05c-4961-b23b-3aae61520cbe" />

Cloudflare will now rebuild and redeploy your site. Once it's finished, you'll have a live URL (e.g., your-project.pages.dev) to share with the world!

## MStream (UI/UX Design of this Template)
<img width="1342" height="629" alt="image" src="https://github.com/user-attachments/assets/ef2620be-f140-404f-9442-7f9c995461e6" />
<img width="1320" height="542" alt="image" src="https://github.com/user-attachments/assets/d98c7f6a-6934-4682-80c7-33780d2ceaba" />
<img width="1334" height="548" alt="image" src="https://github.com/user-attachments/assets/8887a592-72f0-47ad-bb91-539a2a257479" />
<img width="1334" height="552" alt="image" src="https://github.com/user-attachments/assets/3bc917e6-a51e-4568-b1cd-797ca51af504" />
