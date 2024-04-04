import { Inter } from 'next/font/google'
import {GameContextProvider, GridContextProvider} from "@/context/ContextProvider";

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Word Puzzle',
  description: 'A word puzzle game created for kids.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col justify-center items-center`}>
            {/*<Navbar />*/}
            <div className={'mb-10'}>
                <p className={'text-slate-700 text-xl'}>Find and color the words in the word search. Then write the words you found on the lines below.</p>
            </div>
            <div>
                <GridContextProvider>
                    <GameContextProvider>
                        {children}
                    </GameContextProvider>
                </GridContextProvider>
            </div>

        </body>
    </html>
  )
}
