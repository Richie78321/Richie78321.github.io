import BaseLayout from '../layouts/BaseLayout'

export default function Home() {
  return (
    <BaseLayout title="Richie Goulazian - Portfolio">
      <div className="container">
        <div className="mt-5 d-flex flex-column">
          <img id="photo" className="rounded-circle d-block mx-auto" src="/photo.jpg" />
          <h1 id="name" className="display-4 mt-4 text-center">Richie Goulazian</h1>
        </div>
      </div>

      <style jsx>{`
        #photo {
          width: 150px;
        }

        #name {
          font-family: Oswald, sans-serif;
        }
      `}</style>
    </BaseLayout>
  );
}
