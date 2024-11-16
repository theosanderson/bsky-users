import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
     <Head>
     <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NDR7D0LP60"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NDR7D0LP60');
            `,
          }}
        />
     </Head>
      <body className="antialiased bg-sky-50 ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
