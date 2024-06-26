import { BuildOutput } from "bun";

async function bundle(): Promise<BuildOutput> {
  return await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './out',
    minify: true,
    target: "bun",
  });
}

bundle().then(result => {
  result.logs.forEach(log => console.log(log));
});
