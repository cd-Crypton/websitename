## Guide: Deploying Your Movie Website on Cloudflare Pages
This guide will walk you through the entire process of setting up a movie website template, securing your TMDB API key, preparing your logos, and deploying it for free on Cloudflare's global network.

## Prerequisites
Before you begin, make sure you have the following:
A TMDB Account: To get the necessary API key. If you don't have one, you can sign up for free at themoviedb.org.
A Cloudflare Account: To host your website. Sign up for free at cloudflare.com.

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
- Make some changes (either you clone it locally to edit it or use github codespace for virtual IDE).
    - Website Name (Make sure to double check each HTML file. You can search in repository each instance of: Website Name, websitename and WEBSITENAME so you can find them easily which to edit.)
    - websitename.ico (Placed in websitename/img/websitename.ico)
    - websitename.png (Placed in websitename/img/websitename.png)

Step 3: Publish in Cloudflare - Pages
After you modify the website template, it's time for you to publish it in Cloudflare.

- Log in to your Cloudflare dashboard. (Sign up, if you don't have one. It's free.).
- Go to Workers & Pages.
- In Pages, import an existing Git repository and wait until deployed.
- Then go to Settings (of your project) > Variables and Secrets > Add.
    - Type: Secret
    - Name: Name-it-anything-you-want.
    - Value: Paste-the-API-Key-from-TMDB
    - Save.
- Redeploy (Retry Deployment), to apply the Variables and Secrets into your website.

Cloudflare will now rebuild and redeploy your site. Once it's finished, you'll have a live URL (e.g., your-project.pages.dev) to share with the world!