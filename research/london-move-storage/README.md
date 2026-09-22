# London Move storage spike

22 September 2026. **RESEARCH FINDINGS, NOT A PRODUCTION CONTRACT OR SCALE CERTIFICATION.**

## Decision and scope

The product owner agreed to a smaller London architecture: S3 audio, one streaming-node role, a small coordinator and Move-owned accounting/payout state. Artist ownership is an operator attribute, not a node type. This direction supersedes the preceding RocksDB-first implementation priority and hash-only contract choice. The existing London chapters still need a coordinated specification revision; do not implement their RocksDB ledger or commitment-only settlement design as the new target. This spike investigates storage, not that full rewrite.

Recommend starting with `aptos_std::table::Table` for independent accounting records and balances. Benchmark `aptos_framework::big_ordered_map::BigOrderedMap` as the alternative for densely packed records and ordered traversal. Do not introduce both into production until the workload needs both. No custom RocksDB financial authority is needed alongside Move. Backend queues, sessions and rebuildable reporting remain off-chain.

## What the collections actually offer

| Collection | Verified shape | London fit |
|---|---|---|
| Table | Individual keys stored in separate state items; native keyed access; no enumeration or built-in length | Simplest baseline for independent account, budget and obligation keys; potentially expensive slot-per-entry storage |
| BigOrderedMap | B+ tree spanning storage slots, packed leaf entries, ordered traversal; configurable entry sizes | Candidate for compact accounting records and bounded ordered pages; splits and shared leaves can cause conflicts |
| SmartTable | Linear hashing; current upstream source deprecates it in favour of BigOrderedMap | Do not select for new London code |
| Vector / single-resource map | Contents live together and encounter resource size and read/write costs | Small bounded rights splits/configuration only, not a lifetime stream history |

A set can be represented by a map from an ID to a marker. Accounting normally needs a map from an ID to a record, including amount, state and version. A HashSet by itself does not implement conservation, authorisation, replay prevention or payout correctness. These are contract rules.

Neither map makes one transaction unbounded. BigOrderedMap also has key/value sizing constraints and constructor differences for fixed versus variable-size types. Fixed-size IDs and compact numeric records are a useful starting point. Do not copy `new()` blindly for a variable-size receipt value.

## Bounded accounting design

Keep current funded budgets, accepted aggregate usage needed for allocation, rights versions, unpaid obligations and replay guards in Move resources. Emit immutable usage-acceptance, allocation and payment events from successful transitions. The contract computes or independently validates allocations from authorised usage and funded amounts; it must not blindly accept a server-provided payout amount.

Use natural partitions such as funding period and opaque accounting bucket. For the user-centric model, preserve the listener-budget boundary without publishing identities or detailed listening timelines. Even opaque identifiers can expose linkable listening patterns. Exact public aggregate granularity and privacy are unresolved design gates, not solved by hashing an email.

Use bounded input batches and bounded settlement pages. A whole day's usage, every beneficiary or the whole map must never be processed in one transaction. For proportional allocation, freeze the denominator and applicable rules before processing pages. Persist a cursor and totals, handle integer remainder deterministically, and reject premature finalisation. Do not independently round each page and accidentally change allocations. A bounded per-budget calculation may be simpler for the pilot; do not quietly change user-centric economics to a global pool.

Separate usage accumulation from payout execution. Independent usage keys do not help if every update also mutates a global total, a global next-ID counter, one day's common record, or the same vault. Common recipients and concurrent withdrawals can also contend. Avoid global mutable counters in the hot path; measure actual storage write sets, including framework resource effects. Shard further only after a benchmark identifies the conflict.

For retries, accept the same stable batch ID and payload digest only once; reject conflicting reuse. Contract-level identity alone does not prevent replaying the same underlying usage under a fresh batch ID. The admission protocol also needs non-overlapping sequence ranges or equivalent provenance checks per reporting lane. In the pilot Porto remains the trusted usage admission authority. Closing a period must permanently reject new submissions to that period before any replay metadata can be retired. Do not delete processed IDs and thereby reopen old payment claims.

Retain unpaid obligations until settled. Pay by an atomic contract transition that checks the obligation and updates payout state with the supported USDC transfer in the same transaction. Asset integration is not exercised by this collection spike. Paid history can be represented by immutable events plus sufficient closed-period/settlement state to reject replay. Do not delete authoritative records while contracts still require them.

## History, queries and immutability

Move resources are mutable when module code permits mutation; a map is not inherently an immutable ledger. Enforce closed-period rules and append correction events instead of silently rewriting paid history. Immutable package policy and upgrade authority require their own review.

Events are committed transaction history but are not readable by later Move execution. They cannot replace state needed to reject duplicates or spend limits. Query current state with view functions/keyed table reads. Build bounded history/reporting queries from indexed events. A standard hosted indexer will not necessarily expose arbitrary Porto events as ready-made application tables; a small custom processor may be needed.

Treat an indexer as a projection, report its indexed ledger version and do not infer final payout state from a lagging UI. Historical availability depends on provider retention and your own indexing/archive arrangements. An immutable transaction record does not guarantee every API retains it forever. Keep raw delivery receipts privately for a defined operational retention period. They establish what nodes reported, not human attention.

## Scale and cost observations

A read-only Mainnet snapshot at ledger version **7320108779** found Table, BigOrderedMap and SmartTable ABIs deployed. The observed ordinary transaction-size limit was **65536 bytes**, maximum bytes per write operation **1048576**, and maximum write operations per transaction **8192**. These are observed ceilings, not target batch sizes or a guarantee that a transaction near those ceilings fits execution or I/O gas. Refresh the configuration when benchmarking. See `mainnet-observation.json`.

The gas schedule contains per-slot and per-byte storage fee coefficients. Packed map leaves can reduce slot creation relative to a table entry per receipt, but larger leaf reads/writes, splits and contention can offset that gain. No APT-per-stream quote or performance winner is established here. Measure actual execution, I/O, storage fees and refunds using transaction simulation and realistic state sizes.

Illustration only: one million records per day at 128 logical bytes each creates 46.72 GB of logical payload per year before keys, indexes, tree overhead, history or replication. At a billion lifetime records it is 128 GB. Aggregating the payable units and keeping only necessary active state matters more than renaming the collection. Events also consume history storage and indexing capacity; they are not free storage.

## Executed spike and proof boundary

Result: **PASS, four local Move unit tests**, including exact expected abort codes and module locations for duplicate insertion.

Local unit tests exercise 10000 u64-key/u64-value inserts, reads, updates and removals in each collection, plus duplicate insertion failure. The instruction budget is intentionally raised to 1000000000 for a collection stress check. This is not a realistic single Mainnet transaction, not a concurrency test, and not an end-to-end accounting test. No funds were spent and no contract was deployed.

The test package pins AptosFramework commit `04611dd2cec1f5b7ef21c2cc151e05c587a2ce19`, which matched the framework repository's mainnet branch at observation time. Deployed ABI presence was checked separately; source and ABI checks do not establish byte-for-byte equivalence of deployed code. Upstream comparison also inspected aptos-core commit `b762d569670f9b9ef1a0bcb778c3f3edb944b5ef`.

The installed Aptos CLI 7.10.2 could not parse the current dependency. An isolated official Aptos CLI 9.6.0 binary was used without replacing the installed executable. The local test run used the clean cached framework checkout at the pinned commit; the supplied manifest identifies that same revision portably.

Reproduce with Aptos CLI 9.6.0:

```sh
aptos move test --package-dir research/london-move-storage --instructions 1000000000
```

Run from the docs repository. This package is disposable research, not an application module.

## Remaining storage-selection gate

Before selecting the production collection, compare Table and BigOrderedMap at 10000, 100000 and one million prepopulated records. Test batches of 1, 16, 64 and 128 fixed-size realistic accounting records, plus duplicate retries, conflicting IDs, out-of-order submissions, period closure and payout failure. Treat batch sizes as experiments, not release constants.

Measure new-key versus existing-key costs, sequential versus distributed keys, same versus distinct recipients, concurrent lanes, node splits, p50/p95 latency, transaction bytes, write-set size, execution/I/O gas and net storage fees. Test both cold and warm state. Use current network configuration and framework code. Keep final benchmark state persistent across transactions; the unit-test loop here is not that benchmark.

Storage choice must meet a stated daily volume, peak ingestion rate, active-state retention period and cost per million accepted accounting units. Those product targets are still required. No billion-record capacity or throughput claim is approved by this spike.

## Primary sources

- [Pinned Table implementation](https://github.com/aptos-labs/aptos-framework/blob/04611dd2cec1f5b7ef21c2cc151e05c587a2ce19/aptos-stdlib/sources/table.move)
- [Pinned BigOrderedMap implementation](https://github.com/aptos-labs/aptos-framework/blob/04611dd2cec1f5b7ef21c2cc151e05c587a2ce19/aptos-framework/sources/datastructures/big_ordered_map.move)
- [SmartTable deprecation in upstream source](https://github.com/aptos-labs/aptos-core/blob/b762d569670f9b9ef1a0bcb778c3f3edb944b5ef/aptos-move/framework/aptos-stdlib/sources/data_structures/smart_table.move)
- [Aptos Labs collection design and benchmarks](https://medium.com/aptoslabs/introducing-new-utilities-and-collections-in-aptos-framework-4346d39b6e8e), external benchmark results, not Porto measurements
- [Observed Mainnet gas resource](https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::gas_schedule::GasScheduleV2?ledger_version=7320108779), subject to historical API retention
- [Aptos custom indexer example](https://github.com/aptos-labs/aptos-indexer-processor-example)
