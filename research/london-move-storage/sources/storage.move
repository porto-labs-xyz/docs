module spike::storage {
    use aptos_framework::big_ordered_map;
    use aptos_std::table;

    #[test]
    fun map_grows_and_updates() {
        let m = big_ordered_map::new<u64, u64>();
        let i = 0;
        while (i < 10000) { big_ordered_map::add(&mut m, i, i * 3); i = i + 1; };
        i = 0;
        while (i < 10000) {
            assert!(*big_ordered_map::borrow(&m, &i) == i * 3, 1);
            *big_ordered_map::borrow_mut(&mut m, &i) = i * 3 + 1;
            i = i + 1;
        };
        i = 0;
        while (i < 10000) { assert!(big_ordered_map::remove(&mut m, &i) == i * 3 + 1, 2); i = i + 1; };
        big_ordered_map::destroy_empty(m);
    }

    #[test]
    fun table_grows_and_updates() {
        let t = table::new<u64, u64>();
        let i = 0;
        while (i < 10000) { table::add(&mut t, i, i * 3); i = i + 1; };
        i = 0;
        while (i < 10000) {
            assert!(*table::borrow(&t, i) == i * 3, 1);
            *table::borrow_mut(&mut t, i) = i * 3 + 1;
            i = i + 1;
        };
        i = 0;
        while (i < 10000) { assert!(table::remove(&mut t, i) == i * 3 + 1, 2); i = i + 1; };
        table::drop_unchecked(t);
    }

    #[test]
    #[expected_failure(abort_code = 65537, location = aptos_framework::big_ordered_map)]
    fun map_rejects_duplicate() {
        let m = big_ordered_map::new<u64, bool>();
        big_ordered_map::add(&mut m, 42, true);
        big_ordered_map::add(&mut m, 42, true);
        big_ordered_map::destroy_empty(m);
    }

    #[test]
    #[expected_failure(abort_code = 25607, location = aptos_std::table)]
    fun table_rejects_duplicate() {
        let t = table::new<u64, bool>();
        table::add(&mut t, 42, true);
        table::add(&mut t, 42, true);
        table::drop_unchecked(t);
    }
}
