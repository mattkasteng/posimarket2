# Relatório de Compliance - 2025-11-11T20:46:53.805Z

## Resumo
- security:scan: **Falhou**
- sbom:generate: **OK**
- SBOM salvo em: docs\auditoria\sbom-20251111-17-46-53.json

## Detalhes do Security Scan
```
> marketplace-educacional@0.1.0 security:scan
> tsx scripts/security-scan.ts


node:internal/modules/run_main:123
    triggerUncaughtException(
    ^
Error: Transform failed with 1 error:
C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\scripts\security-scan.ts:41:56: ERROR: Unterminated string literal
    at failureErrorWithLog (C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\node_modules\esbuild\lib\main.js:1467:15)
    at C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\node_modules\esbuild\lib\main.js:736:50
    at responseCallbacks.<computed> (C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\node_modules\esbuild\lib\main.js:603:9)
    at handleIncomingPacket (C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\node_modules\esbuild\lib\main.js:658:12)
    at Socket.readFromStdout (C:\Users\108723\OneDrive - Positivo\Documentos\Other\Marketplace\node_modules\esbuild\lib\main.js:581:7)
    at Socket.emit (node:events:519:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23) {
  name: 'TransformError'
}

Node.js v22.19.0
```

## Detalhes da Geração de SBOM
```
> marketplace-educacional@0.1.0 sbom:generate
> cyclonedx-npm --output-format json --output-file sbom.json
```

## Próximos Passos
- Analisar vulnerabilidades e erros listados acima.
- Registrar ações corretivas no plano de segurança.
- Anexar evidências adicionais, se necessário.
