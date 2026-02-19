'use client';

export default function ContactUs() {
  return (
    <div className="p-10 min-h-screen flex items-center justify-center">
      <div className="bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Contact Us</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input type="text" className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <input type="text" className="input-field" required />
          </div>

          <button type="submit" className="btnsecondary w-full">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
