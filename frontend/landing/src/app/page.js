import ProductCard from "@/components/ProductCard"


let productDetails = [
  {
    name: "Word Search",
    imgSrc: "/word_search.jpg"
  }
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-start justify-start p-14">
      {productDetails.map((product, idx) => <ProductCard key={idx} imgSrc={product.imgSrc} name={product.name} />)}
    </main>
  )
}
