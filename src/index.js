const { dirname, join } = require('node:path')
const { mkdirSync, writeFileSync } = require('node:fs')
const { bundle, browserslistToTargets } = require('lightningcss')
const browserslist = require('browserslist')

function createConfig({ arc, inv }) {
	const { cwd: projectDir } = inv._project
	const { input, output, targets } = Object.fromEntries(arc['lightningcss'] || [])

	return {
		input: join(projectDir, input || join('src', 'css', 'style.css')),
		output: join(projectDir, output || inv.static?.folder || join('public', 'style.css')),
		targets: browserslistToTargets(browserslist(targets || '>= 0.25%')),
	}
}

function build({ arc, inv }, production = false) {
	const { input, output, targets } = createConfig({ arc, inv })

	const result = bundle({
		filename: input,
		targets,
		minify: production,
		sourceMap: production,
		drafts: {
			customMedia: true,
			nesting: true,
		},
	})

	mkdirSync(dirname(output), { recursive: true })
	writeFileSync(output, result.code, 'utf-8')
}

function cleanup(params) {
	const { output } = createConfig(params)
	//console.log(`cleanup: ${output}`)
}

module.exports = {
	sandbox: {
		start({ arc, inventory }) {
			build({ arc, inv: inventory.inv })
		},
		end({ arc, inventory }) {
			cleanup({ arc, inv: inventory.inv })
		},
		watcher({ arc, filename, inventory }) {
			const { cwd } = inventory.inv._project
			const { input } = createConfig({ arc, inv: inventory.inv })
			const entryFilePath = join(cwd, input)

			if (filename === entryFilePath) {
				build({ arc, inv: inventory.inv })
			}
		},
	},
	deploy: {
		start({ arc, inventory }) {
			build({ arc, inv: inventory.inv }, true)
		},
		end({ arc, inventory }) {
			cleanup({ arc, inv: inventory.inv })
		},
	},
}
